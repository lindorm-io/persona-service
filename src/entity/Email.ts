import Joi from "joi";
import { EmailEvent } from "../enum";
import { JOI_EMAIL, JOI_GUID } from "../constant";
import {
  EntityAttributes,
  EntityCreationError,
  EntityKeys,
  JOI_ENTITY_BASE,
  LindormEntity,
  Optional,
} from "@lindorm-io/entity";

export interface EmailAttributes extends EntityAttributes {
  email: string;
  identityId: string;
  primary: boolean;
  verified: boolean;
}

export type EmailOptions = Optional<EmailAttributes, EntityKeys>;

const schema = Joi.object<EmailAttributes>({
  ...JOI_ENTITY_BASE,

  email: JOI_EMAIL.required(),
  identityId: JOI_GUID.required(),
  primary: Joi.boolean().required(),
  verified: Joi.boolean().required(),
});

export class Email extends LindormEntity<EmailAttributes> {
  public readonly email: string;
  public readonly identityId: string;

  private _primary: boolean;
  private _verified: boolean;

  public constructor(options: EmailOptions) {
    super(options);

    this.email = options.email;
    this.identityId = options.identityId;

    this._primary = options.primary;
    this._verified = options.verified;
  }

  public get primary(): boolean {
    return this._primary;
  }
  public set primary(primary: boolean) {
    this._primary = primary;
    this.addEvent(EmailEvent.PRIMARY_CHANGED, { primary });
  }

  public get verified(): boolean {
    return this._verified;
  }
  public set verified(verified: boolean) {
    this._verified = verified;
    this.addEvent(EmailEvent.VERIFIED_CHANGED, { verified });
  }

  public create(): void {
    for (const evt of this.events) {
      if (evt.name !== EmailEvent.CREATED) continue;
      throw new EntityCreationError("Email");
    }

    const { events, ...rest } = this.toJSON();
    this.addEvent(EmailEvent.CREATED, rest);
  }

  public async schemaValidation(): Promise<void> {
    await schema.validateAsync(this.toJSON());
  }

  public toJSON(): EmailAttributes {
    return {
      ...this.defaultJSON(),

      email: this.email,
      identityId: this.identityId,
      primary: this.primary,
      verified: this.verified,
    };
  }
}
