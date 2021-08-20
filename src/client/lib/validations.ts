export function validateCommand(command: string) {
  return command.length > 3;
}

export function validateDescription(description: string) {
  return description.length > 3;
}

export function validateResponse(response: string[]) {
  return response.every((r) => r.length > 3 && r.length < 141);
}
