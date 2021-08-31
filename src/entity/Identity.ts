import Joi from "joi";
import { IdentityEvent, NamingSystem } from "../enum";
import { IdentityAddress } from "../typing";
import {
  JOI_BIRTHDATE,
  JOI_IDENTITY_ADDRESS,
  JOI_IDENTITY_DISPLAY_NAME,
  JOI_LOCALE,
  JOI_NAMING_SYSTEM,
  JOI_ZONE_INFO,
} from "../constant";
import {
  EntityAttributes,
  EntityCreationError,
  EntityKeys,
  JOI_ENTITY_BASE,
  LindormEntity,
  Optional,
} from "@lindorm-io/entity";

export interface IdentityDisplayName {
  name: string;
  number: number;
}

export interface IdentityAttributes extends EntityAttributes {
  address: IdentityAddress;
  birthDate: string;
  displayName: IdentityDisplayName;
  familyName: string;
  gender: string;
  givenName: string;
  gravatar: string;
  locale: string;
  middleName: string;
  namingSystem: string;
  nickname: string;
  picture: string;
  preferredAccessibility: Array<string>;
  preferredUsername: string;
  profile: string;
  pronouns: string;
  socialSecurityNumber: string;
  username: string;
  website: string;
  zoneInfo: string;
}

export type IdentityOptions = Optional<
  IdentityAttributes,
  | EntityKeys
  | "address"
  | "birthDate"
  | "displayName"
  | "familyName"
  | "gender"
  | "givenName"
  | "gravatar"
  | "locale"
  | "middleName"
  | "namingSystem"
  | "nickname"
  | "picture"
  | "preferredAccessibility"
  | "preferredUsername"
  | "profile"
  | "pronouns"
  | "socialSecurityNumber"
  | "username"
  | "website"
  | "zoneInfo"
>;

const schema = Joi.object<IdentityAttributes>({
  ...JOI_ENTITY_BASE,

  address: JOI_IDENTITY_ADDRESS.required(),
  birthDate: JOI_BIRTHDATE.allow(null).required(),
  displayName: JOI_IDENTITY_DISPLAY_NAME.required(),
  familyName: Joi.string().allow(null).required(),
  gender: Joi.string().allow(null).required(),
  givenName: Joi.string().allow(null).required(),
  gravatar: Joi.string().uri().allow(null).required(),
  locale: JOI_LOCALE.allow(null).required(),
  middleName: Joi.string().allow(null).required(),
  namingSystem: JOI_NAMING_SYSTEM.required(),
  nickname: Joi.string().allow(null).required(),
  picture: Joi.string().uri().allow(null).required(),
  preferredAccessibility: Joi.array().items(Joi.string()).required(),
  preferredUsername: Joi.string().allow(null).required(),
  profile: Joi.string().uri().allow(null).required(),
  pronouns: Joi.string().allow(null).required(),
  socialSecurityNumber: Joi.string().allow(null).required(),
  username: Joi.string().lowercase().allow(null).required(),
  website: Joi.string().uri().allow(null).required(),
  zoneInfo: JOI_ZONE_INFO.allow(null).required(),
});

export class Identity extends LindormEntity<IdentityAttributes> {
  private _address: IdentityAddress;
  private _birthDate: string;
  private _displayName: IdentityDisplayName;
  private _familyName: string;
  private _gender: string;
  private _givenName: string;
  private _gravatar: string;
  private _locale: string;
  private _middleName: string;
  private _namingSystem: string;
  private _nickname: string;
  private _picture: string;
  private _preferredAccessibility: Array<string>;
  private _preferredUsername: string;
  private _profile: string;
  private _pronouns: string;
  private _socialSecurityNumber: string;
  private _username: string;
  private _website: string;
  private _zoneInfo: string;

  public constructor(options: IdentityOptions) {
    super(options);

    this._address = {
      country: options.address?.country || null,
      locality: options.address?.locality || null,
      postalCode: options.address?.postalCode || null,
      region: options.address?.region || null,
      streetAddress: options.address?.streetAddress || null,
    };
    this._birthDate = options.birthDate || null;
    this._displayName = {
      name: options.displayName?.name || null,
      number: options.displayName?.number || null,
    };
    this._familyName = options.familyName || null;
    this._gender = options.gender || null;
    this._givenName = options.givenName || null;
    this._gravatar = options.gravatar || null;
    this._locale = options.locale || null;
    this._middleName = options.middleName || null;
    this._namingSystem = options.namingSystem || NamingSystem.GIVEN_FAMILY;
    this._nickname = options.nickname || null;
    this._picture = options.picture || null;
    this._preferredAccessibility = options.preferredAccessibility || [];
    this._preferredUsername = options.preferredUsername || null;
    this._profile = options.profile || null;
    this._pronouns = options.pronouns || null;
    this._socialSecurityNumber = options.socialSecurityNumber || null;
    this._username = options.username || null;
    this._website = options.website || null;
    this._zoneInfo = options.zoneInfo || null;
  }

  public get address(): IdentityAddress {
    return this._address;
  }
  public set address(address: IdentityAddress) {
    this._address = address;
    this.addEvent(IdentityEvent.ADDRESS_CHANGED, { address });
  }

  public get birthDate(): string {
    return this._birthDate;
  }
  public set birthDate(birthDate: string) {
    this._birthDate = birthDate;
    this.addEvent(IdentityEvent.BIRTH_DATE_CHANGED, { birthDate });
  }

  public get displayName(): IdentityDisplayName {
    return this._displayName;
  }
  public set displayName(displayName: IdentityDisplayName) {
    this._displayName = displayName;
    this.addEvent(IdentityEvent.DISPLAY_NAME_CHANGED, { displayName });
  }

  public get familyName(): string {
    return this._familyName;
  }
  public set familyName(familyName: string) {
    this._familyName = familyName;
    this.addEvent(IdentityEvent.FAMILY_NAME_CHANGED, { familyName });
  }

  public get gender(): string {
    return this._gender;
  }
  public set gender(gender: string) {
    this._gender = gender;
    this.addEvent(IdentityEvent.GENDER_CHANGED, { gender });
  }

  public get givenName(): string {
    return this._givenName;
  }
  public set givenName(givenName: string) {
    this._givenName = givenName;
    this.addEvent(IdentityEvent.GIVEN_NAME_CHANGED, { givenName });
  }

  public get gravatar(): string {
    return this._gravatar;
  }
  public set gravatar(gravatar: string) {
    this._gravatar = gravatar;
    this.addEvent(IdentityEvent.GRAVATAR_CHANGED, { gravatar });
  }

  public get locale(): string {
    return this._locale;
  }
  public set locale(locale: string) {
    this._locale = locale;
    this.addEvent(IdentityEvent.LOCALE_CHANGED, { locale });
  }

  public get middleName(): string {
    return this._middleName;
  }
  public set middleName(middleName: string) {
    this._middleName = middleName;
    this.addEvent(IdentityEvent.MIDDLE_NAME_CHANGED, { middleName });
  }

  public get namingSystem(): string {
    return this._namingSystem;
  }
  public set namingSystem(namingSystem: string) {
    this._namingSystem = namingSystem;
    this.addEvent(IdentityEvent.NAMING_SYSTEM_CHANGED, { namingSystem });
  }

  public get nickname(): string {
    return this._nickname;
  }
  public set nickname(nickname: string) {
    this._nickname = nickname;
    this.addEvent(IdentityEvent.NICKNAME_CHANGED, { nickname });
  }

  public get picture(): string {
    return this._picture;
  }
  public set picture(picture: string) {
    this._picture = picture;
    this.addEvent(IdentityEvent.PICTURE_CHANGED, { picture });
  }

  public get preferredAccessibility(): Array<string> {
    return this._preferredAccessibility;
  }
  public set preferredAccessibility(preferredAccessibility: Array<string>) {
    this._preferredAccessibility = preferredAccessibility;
    this.addEvent(IdentityEvent.PREFERRED_ACCESSIBILITY_CHANGED, {
      preferredAccessibility,
    });
  }

  public get preferredUsername(): string {
    return this._preferredUsername;
  }
  public set preferredUsername(preferredUsername: string) {
    this._preferredUsername = preferredUsername;
    this.addEvent(IdentityEvent.PREFERRED_USERNAME_CHANGED, { preferredUsername });
  }

  public get profile(): string {
    return this._profile;
  }
  public set profile(profile: string) {
    this._profile = profile;
    this.addEvent(IdentityEvent.PROFILE_CHANGED, { profile });
  }

  public get pronouns(): string {
    return this._pronouns;
  }
  public set pronouns(pronouns: string) {
    this._pronouns = pronouns;
    this.addEvent(IdentityEvent.PRONOUNS_CHANGED, { pronouns });
  }

  public get socialSecurityNumber(): string {
    return this._socialSecurityNumber;
  }
  public set socialSecurityNumber(socialSecurityNumber: string) {
    this._socialSecurityNumber = socialSecurityNumber;
    this.addEvent(IdentityEvent.SOCIAL_SECURITY_NUMBER_CHANGED, { socialSecurityNumber });
  }

  public get username(): string {
    return this._username;
  }
  public set username(username: string) {
    this._username = username;
    this.addEvent(IdentityEvent.USERNAME_CHANGED, { username });
  }

  public get website(): string {
    return this._website;
  }
  public set website(website: string) {
    this._website = website;
    this.addEvent(IdentityEvent.WEBSITE_CHANGED, { website });
  }

  public get zoneInfo(): string {
    return this._zoneInfo;
  }
  public set zoneInfo(zoneInfo: string) {
    this._zoneInfo = zoneInfo;
    this.addEvent(IdentityEvent.ZONE_INFO_CHANGED, { zoneInfo });
  }

  public create(): void {
    for (const evt of this.events) {
      if (evt.name !== IdentityEvent.CREATED) continue;
      throw new EntityCreationError("Identity");
    }

    const { events, ...rest } = this.toJSON();
    this.addEvent(IdentityEvent.CREATED, rest);
  }

  public async schemaValidation(): Promise<void> {
    await schema.validateAsync(this.toJSON());
  }

  public toJSON(): IdentityAttributes {
    return {
      ...this.defaultJSON(),

      address: this.address,
      birthDate: this.birthDate,
      displayName: this.displayName,
      familyName: this.familyName,
      gender: this.gender,
      givenName: this.givenName,
      gravatar: this.gravatar,
      locale: this.locale,
      middleName: this.middleName,
      namingSystem: this.namingSystem,
      nickname: this.nickname,
      picture: this.picture,
      preferredAccessibility: this.preferredAccessibility,
      preferredUsername: this.preferredUsername,
      profile: this.profile,
      pronouns: this.pronouns,
      socialSecurityNumber: this.socialSecurityNumber,
      username: this.username,
      website: this.website,
      zoneInfo: this.zoneInfo,
    };
  }
}
