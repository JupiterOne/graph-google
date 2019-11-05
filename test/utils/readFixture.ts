import { readFileSync } from "fs";

export default function readFixture(path: string) {
  return async () => {
    const raw = readFileSync(path);
    const result = JSON.parse(raw.toString());
    return result;
  };
}
