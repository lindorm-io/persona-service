import { Identity } from "../entity";
import { IdentityEvent } from "../enum";
import { filter, orderBy } from "lodash";
import { isAfter } from "date-fns";

export const shouldUserinfoReplace = (
  identity: Identity,
  event: IdentityEvent,
  updatedAt: number,
): boolean => {
  const list = filter(identity.events, { name: event });

  if (!list.length) return true;

  const events = orderBy(list, ["date"], ["desc"]);
  const updated = new Date(updatedAt * 1000);

  return isAfter(updated, events[0].date);
};
