import { identityGetAuthMethodsController } from "./get-auth-methods";

jest.mock("../../handler", () => ({
  getConnectedProviders: jest.fn().mockResolvedValue("connectedOpenIdProviders"),
  userinfoEmailGet: jest.fn().mockResolvedValue({ email: "email" }),
  userinfoPhoneNumberGet: jest.fn().mockResolvedValue({ phoneNumber: "phoneNumber" }),
}));

describe("identityGetAuthMethodsController", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      data: {
        id: "id",
      },
    };
  });

  test("should resolve with auth methods", async () => {
    await expect(identityGetAuthMethodsController(ctx)).resolves.toStrictEqual({
      data: {
        connectedOpenIdProviders: "connectedOpenIdProviders",
        email: "email",
        phoneNumber: "phoneNumber",
      },
    });
  });
});
