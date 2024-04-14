import sys

insert_sql = (
    "DELETE FROM public.shadings WHERE layer_id = 3; \n"
    "INSERT INTO public.shadings (id, layer_id, geometry, shade,  add_date, remove_date) VALUES \n"
)


if len(sys.argv) != 2:
    print("Usage: python generate_data_to_insert.py NUM_SHADINGS")
    print("NUM_SHADINGS must be 10, 100 or 1000")
    exit(1)

if int(sys.argv[1]) not in [10, 100, 1000]:
    print("Usage: python generate_data_to_insert.py NUM_SHADINGS")
    print("NUM_SHADINGS must be 10, 100 or 1000")
    exit(1)

NUM_SHADINGS = int(sys.argv[1])
MAX_Y = MAX_X = 10000  # should be lower than large_map.sql bounds
SHADE_WIDTH = 100
STEP_SIZE = 150

SHADING_TYPES = [
    "light shade",
    "partial shade",
    "permanent shade",
    "permanent deep shade",
]


shade_x = 0
shade_y = 0

assert STEP_SIZE > SHADE_WIDTH

for i in range(NUM_SHADINGS):
    shade_id = f"e6622aab-dc5d-4865-89d2-{i: 012d}"
    shading_type = SHADING_TYPES[i % len(SHADING_TYPES)]

    polygon = (
        f"POLYGON(({shade_x} {shade_y}, {shade_x + SHADE_WIDTH} {shade_y}, "
        f"{shade_x + SHADE_WIDTH} {shade_y + SHADE_WIDTH}, {shade_x} {shade_y + SHADE_WIDTH}, {shade_x} {shade_y}))"
    )

    insert_sql += f"('{shade_id}', 3, ST_GeomFromText('{polygon}'), '{shading_type}', NULL, NULL), \n"

    shade_x += STEP_SIZE

    if shade_x + SHADE_WIDTH >= MAX_X:
        shade_x = 0
        shade_y += STEP_SIZE

    if shade_y + SHADE_WIDTH >= MAX_Y:
        print("Error: Not enough space to place all shadings")
        exit(1)


print(insert_sql.rstrip(",\n") + ";")
