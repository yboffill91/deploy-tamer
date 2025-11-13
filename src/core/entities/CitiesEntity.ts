class BaseCitiesEntity {
  id?: number;
  name?: string;
}

export class CountriesEntity extends BaseCitiesEntity {
  readonly iso2?: string;
  readonly iso3?: string;
  readonly region?: string;
  readonly subregion?: string;
}

export class StatesEntity extends BaseCitiesEntity {
  readonly country_id?: number;
  readonly region?: string;
  readonly iso2?: string;
}

export class CitiesEntity extends BaseCitiesEntity {
  readonly state_id?: number;
  readonly country_id?: number;
}
