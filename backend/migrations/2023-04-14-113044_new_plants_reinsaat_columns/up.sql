-- Your SQL goes here
ALTER TABLE plants
ADD COLUMN external_article_number TEXT,
    ADD COLUMN external_portion_content TEXT,
    ADD COLUMN sowing_outdoors_de TEXT,
    ADD COLUMN sowing_outdoors TEXT,
    ADD COLUMN harvest_time TEXT,
    ADD COLUMN spacing_de TEXT,
    ADD COLUMN required_quantity_of_seeds_de TEXT,
    ADD COLUMN required_quantity_of_seeds_en TEXT,
    ADD COLUMN seed_planting_depth_de TEXT,
    ADD COLUMN "seed_weight_1000_de" TEXT,
    ADD COLUMN "seed_weight_1000_en" TEXT,
    ADD COLUMN "seed_weight_1000" TEXT,
    ADD COLUMN machine_cultivation_possible TEXT,
    ADD COLUMN edible_uses_de TEXT;
