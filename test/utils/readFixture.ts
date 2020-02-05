import { readFileSync } from "fs";

export default function readFixture(path: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (): any => {
    const raw = readFileSync(path);
    const result = JSON.parse(raw.toString());
    return result;
  };
}
