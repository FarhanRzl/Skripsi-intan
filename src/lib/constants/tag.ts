// Di-port dari src/lib/constants/tag.ts (project Svelte).

export const TAG_TYPES = {
	DESIGN: 'design',
	SUN_EXPOSURE: 'sun_exposure',
	AREA_SUN_EXPOSURE: 'area_sun_exposure',
	WATERING_FREQUENCY: 'watering_frequency',
	GARDEN_FACING_DIRECTION: 'garden_facing_direction',
	DRAINAGE: 'drainage',
	PLANT_PRESENCE: 'plant_presence',
	WATER_SOURCE: 'water_source',
	ELECTRICITY_SOURCE: 'electricity_source',
	ENTRANCE_ACCESS: 'entrance_access',
	ORDER_TAG: 'order_tag',
	SOIL_MOISTURE: 'soil_moisture',
	SOIL_PLANTING_READINESS: 'soil_planting_readiness',
	GROUND_SURFACE_CONDITION: 'ground_surface_condition',
	CARE_LEVEL: 'care_level',
	SPECIAL_AREA: 'special_area',
	GARDEN_THEME: 'garden_theme',
	SUN_EXPOSURE_OBSTRUCTION: 'sun_exposure_obstruction',
	RAIN_GUTTER_NEED: 'rain_gutter_need',
	RAIN_WATER_FLOW_DIRECTION_NOTE: 'rain_water_flow_direction_note',
	EXPECTED_GARDEN_BUILD_DATE: 'expected_garden_build_date',
	GARDEN_ENTRANCE_ACCESS: 'garden_entrance_access',
	LAND_PREPARATION: 'land_preparation',
	CHILDREN_PRESENCE: 'children_presence',
	ANIMAL_PRESENCE: 'animal_presence',
	PLANT_FUNCTION: 'plant_function',
	PLANT_TYPE: 'plant_type',
	PLANT_ORIGIN: 'plant_origin',
	TOXICITY: 'toxicity',
	ATTRACTIVENESS: 'attractiveness',
	FLOWER_TYPE: 'flower_type',
	LEAF_FLOWER_COLOR: 'leaf_flower_color',
	PLANT_SIZE: 'plant_size',
	EDIBILITY: 'edibility',
	PHYSICAL_TEXTURE: 'physical_texture',
	FERTILIZATION_FREQUENCY: 'fertilization_frequency',
	TEMPERATURE: 'temperature',
	HUMIDITY: 'humidity',
	FIXED_STRUCTURE: 'fixed_structure'
} as const;	

export type TagType = (typeof TAG_TYPES)[keyof typeof TAG_TYPES];

export const TAG = {
	ELECTRICITY_SOURCE_NONE: '38',
	GARDEN_ENTRANCE_ACCESS_OTHER: '97',
	LAND_PREPARATION_READY_TO_PLANT: '98',
	SOIL_PLANTING_READINESS_NOT_READY: '68',
	ANIMAL_PRESENCE_OTHER: '117',
	SPECIAL_AREA_OTHER: '73',
	FIXED_STRUCTURE_NONE: '107'
};