class BaseResponseDTO {
  id?: number;
  name?: string;
}

export class ResponseCountriesDTO extends BaseResponseDTO {
  readonly iso2?: string;
  readonly iso3?: string;
  readonly numeric_code?: string;
  readonly region?: string;
  readonly subregion?: string;
}

export class ResponseStatesDTO extends BaseResponseDTO {
  readonly country_id?: number;
  readonly region?: string;
  readonly iso2?: string;
}

export class ResponseCitiesDTO extends BaseResponseDTO {
    readonly state_id?: number;
    readonly country_id?: number;
    
}
