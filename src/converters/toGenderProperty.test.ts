import toGenderProperty from "./toGenderProperty";

test("undefined", async() => {
  expect(toGenderProperty(undefined)).toEqual(undefined);
});

test("string", async() => {
  expect(toGenderProperty("male")).toEqual("male");
});

describe("object", () => {
  test("type male", async() => {
    expect(toGenderProperty({ type: "male" })).toEqual("male");
  });

  test("type female", async() => {
    expect(toGenderProperty({ type: "female" })).toEqual("female");
  });

  test("type unknown", async() => {
    expect(toGenderProperty({ type: "unknown" })).toEqual(undefined);
  });

  test("type other, no customGender", async() => {
    expect(toGenderProperty({ type: "other" })).toEqual("other");
  });

  test("type other, customGender", async() => {
    expect(toGenderProperty({ type: "other", customGender: "custom business" })).toEqual("custom business");
  });

  test("type other, customGender, addressMeAs ignored", async() => {
    expect(toGenderProperty({ type: "other", customGender: "custom business" })).toEqual("custom business");
  });
});
