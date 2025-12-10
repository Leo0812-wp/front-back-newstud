/**
 * Script de bootstrap pour créer un compte admin.
 * Usage :
 *   node scripts/createAdmin.js --username=admin --password=changeme
 */

const bcrypt = require('bcrypt');
const admin = require('../src/config/firebase');

const parseArgs = () => {
  const args = process.argv.slice(2);
  const result = {};
  args.forEach(arg => {
    const [key, value] = arg.replace(/^--/, '').split('=');
    result[key] = value;
  });
  return result;
};

async function main() {
  const { username, password } = parseArgs();
  if (!username || !password) {
    console.error('Usage: node scripts/createAdmin.js --username=<nom> --password=<motdepasse>');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await admin.firestore().collection('userAdmin').doc(username).set({
    username,
    password: hashedPassword,
    role: 'admin',
    createdAt: new Date().toISOString(),
  });

  console.log(`✅ Compte admin créé: ${username}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
