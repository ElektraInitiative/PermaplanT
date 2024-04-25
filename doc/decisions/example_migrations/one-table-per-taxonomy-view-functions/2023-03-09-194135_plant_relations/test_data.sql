-- Insert into family
INSERT INTO families (id, name, property1) VALUES (
    1, 'Family1', 'Family1Property1'
);
INSERT INTO families (id, name, property1) VALUES (2, 'Family2', null);

-- Insert into genus
INSERT INTO genera (id, name, property1, family_id) VALUES (
    1, 'Genus1', 'Genus1Property1', 1
);
INSERT INTO genera (id, name, property1, family_id) VALUES (
    2, 'Genus2', null, 1
);
INSERT INTO genera (id, name, property1, family_id) VALUES (
    3, 'Genus3', 'Genus3Property1', 2
);
INSERT INTO genera (id, name, property1, family_id) VALUES (
    4, 'Genus4', null, 2
);

-- Insert into species
INSERT INTO species (id, name, property1, genus_id) VALUES (
    1, 'Species1', 'Species1Property1', 1
);
INSERT INTO species (id, name, property1, genus_id) VALUES (
    2, 'Species2', null, 1
);
INSERT INTO species (id, name, property1, genus_id) VALUES (
    3, 'Species3', 'Species3Property1', 2
);
INSERT INTO species (id, name, property1, genus_id) VALUES (
    4, 'Species4', null, 2
);

INSERT INTO species (id, name, property1, genus_id) VALUES (
    5, 'Species5', 'Species5Property1', 3
);
INSERT INTO species (id, name, property1, genus_id) VALUES (
    6, 'Species6', null, 3
);
INSERT INTO species (id, name, property1, genus_id) VALUES (
    7, 'Species7', 'Species7Property1', 4
);
INSERT INTO species (id, name, property1, genus_id) VALUES (
    8, 'Species8', null, 4
);

-- Insert into variety
INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (
    1,
    'Variety1',
    'UniqueVariety1',
    ARRAY['CommonEn1'],
    ARRAY['CommonDe1'],
    'Variety1Property1',
    1
);
INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (2, 'Variety2', 'UniqueVariety2', null, null, null, 1);
INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (
    3,
    'Variety3',
    'UniqueVariety3',
    ARRAY['CommonEn3'],
    ARRAY['CommonDe3'],
    'Variety3Property1',
    2
);
INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (4, 'Variety4', 'UniqueVariety4', null, null, null, 2);

INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (
    5,
    'Variety5',
    'UniqueVariety5',
    ARRAY['CommonEn5'],
    ARRAY['CommonDe5'],
    'Variety5Property1',
    3
);
INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (6, 'Variety6', 'UniqueVariety6', null, null, null, 3);
INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (
    7,
    'Variety7',
    'UniqueVariety7',
    ARRAY['CommonEn7'],
    ARRAY['CommonDe7'],
    'Variety7Property1',
    4
);
INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (8, 'Variety8', 'UniqueVariety8', null, null, null, 4);

INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (
    9,
    'Variety9',
    'UniqueVariety9',
    ARRAY['CommonEn9'],
    ARRAY['CommonDe9'],
    'Variety9Property1',
    5
);
INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (10, 'Variety10', 'UniqueVariety10', null, null, null, 5);
INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (
    11,
    'Variety11',
    'UniqueVariety11',
    ARRAY['CommonEn11'],
    ARRAY['CommonDe11'],
    'Variety11Property1',
    6
);
INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (12, 'Variety12', 'UniqueVariety12', null, null, null, 6);

INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (
    13,
    'Variety13',
    'UniqueVariety13',
    ARRAY['CommonEn13'],
    ARRAY['CommonDe13'],
    'Variety13Property1',
    7
);
INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (14, 'Variety14', 'UniqueVariety14', null, null, null, 7);
INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (
    15,
    'Variety15',
    'UniqueVariety15',
    ARRAY['CommonEn15'],
    ARRAY['CommonDe15'],
    'Variety15Property1',
    8
);
INSERT INTO varieties (
    id, name, unique_name, common_name_en, common_name_de, property1, species_id
) VALUES (16, 'Variety16', 'UniqueVariety16', null, null, null, 8);

-- Insert into cultivar
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar1',
    ARRAY['CommonEnC1'],
    ARRAY['CommonDeC1'],
    'Cultivar1Property1',
    1,
    null
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar2', null, null, null, 1, null);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar3',
    ARRAY['CommonEnC3'],
    ARRAY['CommonDeC3'],
    'Cultivar3Property1',
    2,
    null
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar4', null, null, null, 2, null);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar5',
    ARRAY['CommonEnC5'],
    ARRAY['CommonDeC5'],
    'Cultivar5Property1',
    null,
    3
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar6', null, null, null, null, 3);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar7',
    ARRAY['CommonEnC6'],
    ARRAY['CommonDeC6'],
    'Cultivar7Property1',
    null,
    4
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar8', null, null, null, null, 4);

INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar9',
    ARRAY['CommonEnC9'],
    ARRAY['CommonDeC9'],
    'Cultivar9Property1',
    1,
    null
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar10', null, null, null, 1, null);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar11',
    ARRAY['CommonEnC11'],
    ARRAY['CommonDeC11'],
    'Cultivar11Property1',
    2,
    null
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar12', null, null, null, 2, null);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar13',
    ARRAY['CommonEnC13'],
    ARRAY['CommonDeC13'],
    'Cultivar13Property1',
    null,
    3
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar14', null, null, null, null, 3);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar15',
    ARRAY['CommonEnC15'],
    ARRAY['CommonDeC15'],
    'Cultivar15Property1',
    null,
    4
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar16', null, null, null, null, 4);

INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar17',
    ARRAY['CommonEnC17'],
    ARRAY['CommonDeC17'],
    'Cultivar17Property1',
    1,
    null
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar18', null, null, null, 1, null);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar19',
    ARRAY['CommonEnC19'],
    ARRAY['CommonDeC19'],
    'Cultivar19Property1',
    2,
    null
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar20', null, null, null, 2, null);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar21',
    ARRAY['CommonEnC21'],
    ARRAY['CommonDeC21'],
    'Cultivar21Property1',
    null,
    3
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar22', null, null, null, null, 3);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar23',
    ARRAY['CommonEnC23'],
    ARRAY['CommonDeC23'],
    'Cultivar23Property1',
    null,
    4
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar24', null, null, null, null, 4);

INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar25',
    ARRAY['CommonEnC25'],
    ARRAY['CommonDeC25'],
    'Cultivar25Property1',
    1,
    null
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar26', null, null, null, 1, null);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar27',
    ARRAY['CommonEnC27'],
    ARRAY['CommonDeC27'],
    'Cultivar27Property1',
    2,
    null
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar28', null, null, null, 2, null);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar29',
    ARRAY['CommonEnC29'],
    ARRAY['CommonDeC29'],
    'Cultivar29Property1',
    null,
    3
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar30', null, null, null, null, 3);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES (
    'UniqueCultivar31',
    ARRAY['CommonEnC31'],
    ARRAY['CommonDeC31'],
    'Cultivar31Property1',
    null,
    4
);
INSERT INTO cultivars (
    unique_name,
    common_name_en,
    common_name_de,
    property1,
    species_id,
    variety_id
) VALUES ('UniqueCultivar32', null, null, null, null, 4);
