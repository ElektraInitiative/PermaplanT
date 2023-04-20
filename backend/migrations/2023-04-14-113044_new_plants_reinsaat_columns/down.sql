-- This file should undo anything in `up.sql`
ALTER TABLE plants DROP COLUMN external_article_number,
    DROP COLUMN external_portion_content,
    DROP COLUMN sowing_outdoors_de,
    DROP COLUMN harvest_time,
    DROP COLUMN spacing_de,
    DROP COLUMN required_quantity_of_seeds_de,
    DROP COLUMN required_quantity_of_seeds_en,
    DROP COLUMN seed_planting_depth_de,
    DROP COLUMN "seed_weight_1000_de",
    DROP COLUMN "seed_weight_1000_en",
    DROP COLUMN "seed_weight_1000",
    DROP COLUMN machine_cultivation_possible,
    DROP COLUMN edible_uses_de;
