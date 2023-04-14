-- This file should undo anything in `up.sql`
ALTER TABLE plants DROP COLUMN reinsaat_article_number,
    DROP COLUMN reinsaat_portion_content,
    DROP COLUMN sowing_outdoors_de,
    DROP COLUMN reinsaat_url,
    DROP COLUMN harvest_time,
    DROP COLUMN spacing_de,
    DROP COLUMN required_quantity_of_seeds_de,
    DROP COLUMN required_quantity_of_seeds_en,
    DROP COLUMN seed_planting_depth_de,
    DROP COLUMN "1000_seed_weight_de",
    DROP COLUMN "1000_seed_weight_en",
    DROP COLUMN "1000_seed_weight",
    DROP COLUMN machine_cultivation_possible;
