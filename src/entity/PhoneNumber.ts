import Joi from "joi";
import { PhoneNumberEvent } from "../enum";
import { JOI_GUID, JOI_PHONE_NUMBER } from "../constant";
import {
  EntityAttributes,
  EntityCreationError,
  EntityKeys,
  JOI_ENTITY_BASE,
  LindormEntity,
  Optional,
} from "@lindorm-io/entity";

export interface PhoneNumberAttributes extends EntityAttributes {
  identityId: string;
  phoneNumber: string;
  primary: boolean;
  verified: boolean;
}

export type PhoneNumberOptions = Optional<PhoneNumberAttributes, EntityKeys>;

const schema = Joi.object<PhoneNumberAttributes>({
  ...JOI_ENTITY_BASE,

  identityId: JOI_GUID.required(),
  phoneNumber: JOI_PHONE_NUMBER.required(),
  primary: Joi.boolean().required(),
  verified: Joi.boolean().required(),
});

export class PhoneNumber extends LindormEntity<PhoneNumberAttributes> {
  public readonly identityId: string;
  public readonly phoneNumber: string;

  private _primary: boolean;
  private _verified: boolean;

  public constructor(options: PhoneNumberOptions) {
    super(options);

    this.identityId = options.identityId;
    this.phoneNumber = options.phoneNumber;

    this._primary = options.primary;
    this._verified = options.verified;
  }

  public get primary(): boolean {
    return this._primary;
  }
  public set primary(primary: boolean) {
    this._primary = primary;
    this.addEvent(PhoneNumberEvent.PRIMARY_CHANGED, { primary });
  }

  public get verified(): boolean {
    return this._verified;
  }
  public set verified(verified: boolean) {
    this._verified = verified;
    this.addEvent(PhoneNumberEvent.VERIFIED_CHANGED, { verified });
  }

  public create(): void {
    for (const evt of this.events) {
      if (evt.name !== PhoneNumberEvent.CREATED) continue;
      throw new EntityCreationError("PhoneNumber");
    }

    const { events, ...rest } = this.toJSON();
    this.addEvent(PhoneNumberEvent.CREATED, rest);
  }

  public async schemaValidation(): Promise<void> {
    await schema.validateAsync(this.toJSON());
  }

  public toJSON(): PhoneNumberAttributes {
    return {
      ...this.defaultJSON(),

      identityId: this.identityId,
      phoneNumber: this.phoneNumber,
      primary: this.primary,
      verified: this.verified,
    };
  }
}
