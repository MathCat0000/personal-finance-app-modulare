import { addMoneyToPot, createPot, deletePot, editPot, withdrawFromPot } from "../core/actions.js";

export function handlePotAction(type, data, id) {
  if (type === "pot-create") {
    createPot({ name: data.get("name"), target: data.get("target"), theme: data.get("theme") });
    return "Pot added.";
  }
  if (type === "pot-edit") {
    editPot(id, { name: data.get("name"), target: data.get("target"), theme: data.get("theme") });
    return "Pot updated.";
  }
  if (type === "pot-add") {
    addMoneyToPot(id, data.get("amount"));
    return "Money added to pot.";
  }
  if (type === "pot-withdraw") {
    withdrawFromPot(id, data.get("amount"));
    return "Money withdrawn from pot.";
  }
  if (type === "pot-delete") {
    deletePot(id);
    return "Pot deleted.";
  }
  return null;
}
