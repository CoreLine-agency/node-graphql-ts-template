export function fixId(input) {
  if (input.id) {
    input.id = parseInt(input.id, 10);
  }
}
