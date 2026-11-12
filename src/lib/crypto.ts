/** Simulated password storage — not for production use */
export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`gpa-mock:${password}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return (await hashPassword(password)) === passwordHash;
}
