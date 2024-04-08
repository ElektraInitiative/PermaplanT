DELETE FROM public.shadings WHERE layer_id = 3;
INSERT INTO public.shadings (id, layer_id, geometry, shade, add_date, remove_date) VALUES
(
    'e6622aab-dc5d-4865-89d2-000000000000',
    3,
    st_geomfromtext('POLYGON((0 0, 100 0, 100 100, 0 100, 0 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000001',
    3,
    st_geomfromtext('POLYGON((150 0, 250 0, 250 100, 150 100, 150 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000002',
    3,
    st_geomfromtext('POLYGON((300 0, 400 0, 400 100, 300 100, 300 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000003',
    3,
    st_geomfromtext('POLYGON((450 0, 550 0, 550 100, 450 100, 450 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000004',
    3,
    st_geomfromtext('POLYGON((600 0, 700 0, 700 100, 600 100, 600 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000005',
    3,
    st_geomfromtext('POLYGON((750 0, 850 0, 850 100, 750 100, 750 0))'),
    'partial shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000006',
    3,
    st_geomfromtext('POLYGON((900 0, 1000 0, 1000 100, 900 100, 900 0))'),
    'permanent shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000007',
    3,
    st_geomfromtext('POLYGON((1050 0, 1150 0, 1150 100, 1050 100, 1050 0))'),
    'permanent deep shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000008',
    3,
    st_geomfromtext('POLYGON((1200 0, 1300 0, 1300 100, 1200 100, 1200 0))'),
    'light shade',
    null,
    null
),
(
    'e6622aab-dc5d-4865-89d2-000000000009',
    3,
    st_geomfromtext('POLYGON((1350 0, 1450 0, 1450 100, 1350 100, 1350 0))'),
    'partial shade',
    null,
    null
);
