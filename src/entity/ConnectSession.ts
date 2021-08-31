import Joi from "joi";
import {
  EntityAttributes,
  EntityKeys,
  JOI_ENTITY_BASE,
  LindormEntity,
  Optional,
} from "@lindorm-io/entity";
import { JOI_EMAIL, JOI_IDENTIFIER_TYPE, JOI_SIGNATURE } from "../constant";

export interface ConnectSessionAttributes extends EntityAttributes {
  code: string;
  identifier: string;
  type: string;
}

export type ConnectSessionOptions = Optional<ConnectSessionAttributes, EntityKeys>;

const schema = Joi.object<ConnectSessionAttributes>({
  ...JOI_ENTITY_BASE,

  code: JOI_SIGNATURE.required(),
  identifier: JOI_EMAIL.required(),
  type: JOI_IDENTIFIER_TYPE.required(),
});

export class ConnectSession extends LindormEntity<ConnectSessionAttributes> {
  public readonly code: string;
  public readonly identifier: string;
  public readonly type: string;

  public constructor(options: ConnectSessionOptions) {
    super(options);

    this.code = options.code;
    this.identifier = options.identifier;
    this.type = options.type;
  }

  public create(): void {
    /* intentionally left empty */
  }

  public async schemaValidation(): Promise<void> {
    await schema.validateAsync(this.toJSON());
  }

  public toJSON(): ConnectSessionAttributes {
    return {
      ...this.defaultJSON(),

      code: this.code,
      identifier: this.identifier,
      type: this.type,
    };
  }
}
