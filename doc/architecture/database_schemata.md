classDiagram

class tag {
  <<enumeration>>
  Leaf crops
  Fruit crops
  Root crops
  Flowering crops
  Herbs
  Other
}

class quality {
  <<enumeration>>
  Organic
  Not organic
  Unknown
}

class seeds {
  --
  id
  tag
  type
  plant_id
  harvest_year
  use_by
  origin
  flavor
  yield
  quantity
  quality
  price
  generation
  notes
}

class plants {
  --
  id
  tag
  type
  synonym
  sowing
  sowing_depth
  germination_temperature
  prick_out
  transplant
  row_spacing
  plant_density
  germination_time
  harvest_time
  location
  care
  height
}

seeds -- plants : 1 to 1
