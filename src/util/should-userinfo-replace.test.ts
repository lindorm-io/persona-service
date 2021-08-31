import MockDate from "mockdate";
import { shouldUserinfoReplace } from "./should-userinfo-replace";
import { Identity } from "../entity";
import { IdentityEvent } from "../enum";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("shouldUserinfoReplace", () => {
  test("should resolve true", () => {
    const identity = new Identity({});
    identity.givenName = "givenName";

    expect(
      shouldUserinfoReplace(identity, IdentityEvent.GIVEN_NAME_CHANGED, 1609488001),
    ).toBe(true);
  });

  test("should resolve false and sort events descending", () => {
    const identity = new Identity({
      events: [
        {
          name: IdentityEvent.GIVEN_NAME_CHANGED,
          date: new Date("1999-01-01T08:00:00.000Z"),
          payload: { givenName: "one" },
        },
        {
          name: IdentityEvent.GIVEN_NAME_CHANGED,
          date: new Date("2001-01-01T08:00:00.000Z"),
          payload: { givenName: "two" },
        },
        {
          name: IdentityEvent.GIVEN_NAME_CHANGED,
          date: new Date("2021-02-01T08:00:00.000Z"),
          payload: { givenName: "two" },
        },
      ],
    });

    expect(
      shouldUserinfoReplace(identity, IdentityEvent.GIVEN_NAME_CHANGED, 1609488000),
    ).toBe(false);
  });

  test("should resolve false", () => {
    const identity = new Identity({});
    identity.givenName = "givenName";

    expect(
      shouldUserinfoReplace(identity, IdentityEvent.GIVEN_NAME_CHANGED, 1609487000),
    ).toBe(false);
  });

  test("should resolve true when there are no events", () => {
    const identity = new Identity({});

    expect(
      shouldUserinfoReplace(identity, IdentityEvent.GIVEN_NAME_CHANGED, 1609487000),
    ).toBe(true);
  });
});
