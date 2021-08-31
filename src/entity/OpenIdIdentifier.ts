import Joi from "joi";
import {
  EntityAttributes,
  EntityKeys,
  JOI_ENTITY_BASE,
  LindormEntity,
  Optional,
} from "@lindorm-io/entity";
import { JOI_GUID } from "../constant";

export interface OpenIdIdentifierAttributes extends EntityAttributes {
  identifier: string;
  identityId: string;
  provider: string;
}

export type OpenIdIdentifierOptions = Optional<OpenIdIdentifierAttributes, EntityKeys>;

const schema = Joi.object<OpenIdIdentifierAttributes>({
  ...JOI_ENTITY_BASE,

  identifier: Joi.string().required(),
  identityId: JOI_GUID.required(),
  provider: Joi.string().uri().required(),
});

export class OpenIdIdentifier extends LindormEntity<OpenIdIdentifierAttributes> {
  public readonly identifier: string;
  public readonly identityId: string;
  public readonly provider: string;

  public constructor(options: OpenIdIdentifierOptions) {
    super(options);

    this.identifier = options.identifier;
    this.identityId = options.identityId;
    this.provider = options.provider;
  }

  public create(): void {
    /* intentionally left empty */
  }

  public async schemaValidation(): Promise<void> {
    await schema.validateAsync(this.toJSON());
  }

  public toJSON(): OpenIdIdentifierAttributes {
    return {
      ...this.defaultJSON(),

      identifier: this.identifier,
      identityId: this.identityId,
      provider: this.provider,
    };
  }
}
