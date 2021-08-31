import { OpenIdIdentifierAttributes, OpenIdIdentifier } from "../../entity";
import { RepositoryOptions, LindormRepository } from "@lindorm-io/mongo";

export class OpenIdIdentifierRepository extends LindormRepository<
  OpenIdIdentifierAttributes,
  OpenIdIdentifier
> {
  public constructor(options: RepositoryOptions) {
    super({
      ...options,
      collectionName: "open_id_identifier",
      indices: [
        {
          index: { identityId: 1 },
          options: { unique: false },
        },
        {
          index: { identifier: 1 },
          options: { unique: true },
        },
      ],
    });
  }

  protected createEntity(data: OpenIdIdentifierAttributes): OpenIdIdentifier {
    return new OpenIdIdentifier(data);
  }
}
