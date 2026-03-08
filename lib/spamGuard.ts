/**
 * Client-side spam/bot detection for lead forms.
 *
 * Four layers:
 * 1. Disposable-email blocklist — blocks known throwaway domains.
 * 2. Heuristic detection — catches bot-generated emails by pattern.
 * 3. Timing trap — rejects submissions faster than a human can type.
 * 4. Rate limit — caps submissions per session via localStorage.
 */

// ── Disposable email domains ────────────────────────────────────────────
// Comprehensive list of known disposable/temporary email services.
// Includes domains seen in actual spam plus widely-used throwaway services.
const DISPOSABLE_DOMAINS: ReadonlySet<string> = new Set([
  // Domains seen in actual spam attacks
  '7novels.com',
  'armyspy.com',
  'cslua.com',

  // Major disposable email services
  '10minutemail.com',
  '10minutemail.net',
  '10minutemail.org',
  '20minutemail.com',
  '33mail.com',
  'anonbox.net',
  'binkmail.com',
  'bobmail.info',
  'bugmenot.com',
  'bumpymail.com',
  'celtnow.com',
  'claramail.com',
  'cuvox.de',
  'dayrep.com',
  'discard.email',
  'discardmail.com',
  'discardmail.de',
  'dispostable.com',
  'dodgeit.com',
  'dodgit.com',
  'drdrb.com',
  'e4ward.com',
  'einrot.com',
  'email-fake.com',
  'emailfake.com',
  'emailgo.de',
  'emailisvalid.com',
  'emailondeck.com',
  'emailsensei.com',
  'emailtemporario.com.br',
  'emz.net',
  'enterto.com',
  'ephemail.net',
  'esiix.com',
  'example.com',
  'eyepaste.com',
  'fakeinbox.com',
  'fakemail.fr',
  'fakemailgenerator.com',
  'fastacura.com',
  'filzmail.com',
  'fixmail.tk',
  'fleckens.hu',
  'flyspam.com',
  'foy.kr',
  'fuckingduh.com',
  'garliclife.com',
  'get-mail.cf',
  'getairmail.com',
  'getnada.com',
  'getonemail.com',
  'getonemail.net',
  'gishpuppy.com',
  'grr.la',
  'guerrillamail.biz',
  'guerrillamail.com',
  'guerrillamail.de',
  'guerrillamail.info',
  'guerrillamail.net',
  'guerrillamailblock.com',
  'gustr.com',
  'harakirimail.com',
  'hidemail.de',
  'hmamail.com',
  'hulapla.de',
  'ieh-mail.de',
  'imgof.com',
  'inboxalias.com',
  'incognitomail.com',
  'incognitomail.net',
  'incognitomail.org',
  'ipoo.org',
  'irish2me.com',
  'jetable.com',
  'jetable.fr.nf',
  'jetable.net',
  'jetable.org',
  'jourrapide.com',
  'junk1.com',
  'kasmail.com',
  'kcrw.de',
  'klzlk.com',
  'lackmail.net',
  'lhsdv.com',
  'lifebyfood.com',
  'link2mail.net',
  'litedrop.com',
  'lol.ovpn.to',
  'lookugly.com',
  'lr78.com',
  'lroid.com',
  'm21.cc',
  'mail-temporaire.fr',
  'mail.by',
  'mail.mezimages.net',
  'mail.zp.ua',
  'mail2rss.org',
  'mail333.com',
  'mailbidon.com',
  'mailblocks.com',
  'mailcatch.com',
  'mailde.de',
  'mailde.info',
  'maildrop.cc',
  'maildrop.cf',
  'maildrop.ga',
  'maildrop.gq',
  'maildrop.ml',
  'mailexpire.com',
  'mailfa.tk',
  'mailforspam.com',
  'mailfreeonline.com',
  'mailguard.me',
  'mailhazard.com',
  'mailhazard.us',
  'mailhz.me',
  'mailimate.com',
  'mailin8r.com',
  'mailinater.com',
  'mailinator.com',
  'mailinator.net',
  'mailinator.org',
  'mailinator2.com',
  'mailincubator.com',
  'mailismagic.com',
  'mailjunk.cf',
  'mailjunk.ga',
  'mailjunk.gq',
  'mailjunk.ml',
  'mailjunk.tk',
  'mailmate.com',
  'mailme.ir',
  'mailme.lv',
  'mailmetrash.com',
  'mailmoat.com',
  'mailnator.com',
  'mailnesia.com',
  'mailnull.com',
  'mailpick.biz',
  'mailproxsy.com',
  'mailquack.com',
  'mailrock.biz',
  'mailsac.com',
  'mailscrap.com',
  'mailshell.com',
  'mailsiphon.com',
  'mailslite.com',
  'mailtemp.info',
  'mailtemp.net',
  'mailtothis.com',
  'mailtrash.net',
  'mailzilla.com',
  'mailzilla.org',
  'makemetheking.com',
  'manifestgenerator.com',
  'meltmail.com',
  'messagebeamer.de',
  'mezimages.net',
  'mfsa.ru',
  'mintemail.com',
  'mohmal.com',
  'moncourrier.fr.nf',
  'monemail.fr.nf',
  'monmail.fr.nf',
  'mt2015.com',
  'mx0.wwwnew.eu',
  'myalias.pw',
  'mycard.net.ua',
  'mycleaninbox.net',
  'myemailboxy.com',
  'mymail-in.net',
  'mypacks.net',
  'mypartyclip.de',
  'myphantom.com',
  'mysamp.de',
  'mytemp.email',
  'mytempmail.com',
  'mytrashmail.com',
  'nabala.com',
  'nedoz.com',
  'nervmich.net',
  'nervtansen.de',
  'netmails.com',
  'netmails.net',
  'neverbox.com',
  'no-spam.ws',
  'nobulk.com',
  'noclickemail.com',
  'nogmailspam.info',
  'nomail.xl.cx',
  'nomail2me.com',
  'nomorespamemails.com',
  'nospam.ze.tc',
  'nospam4.us',
  'nospamfor.us',
  'nospammail.net',
  'nothingtoseehere.ca',
  'nowmymail.com',
  'nurfuerspam.de',
  'nus.edu.sg',
  'nwldx.com',
  'objectmail.com',
  'obobbo.com',
  'odnorazovoe.ru',
  'oneoffemail.com',
  'onewaymail.com',
  'oopi.org',
  'ordinaryamerican.net',
  'ownmail.net',
  'ownsyou.de',
  'pjjkp.com',
  'plexolan.de',
  'pookmail.com',
  'privacy.net',
  'proxymail.eu',
  'prtnx.com',
  'punkass.com',
  'putthisinyouremail.com',
  'qq.com',
  'quickinbox.com',
  'rcpt.at',
  'reallymymail.com',
  'receiveee.com',
  'regbypass.com',
  'rejectmail.com',
  'rhyta.com',
  'rklips.com',
  'rmqkr.net',
  'royal.net',
  'rppkn.com',
  'rtrtr.com',
  'safersignup.de',
  'safetymail.info',
  'safetypost.de',
  'sandelf.de',
  'saynotospams.com',
  'scatmail.com',
  'schafmail.de',
  'selfdestructingmail.com',
  'sendspamhere.com',
  'sharkface.com',
  'sharklasers.com',
  'shieldedmail.com',
  'shiftmail.com',
  'shhmail.com',
  'shortmail.net',
  'sibmail.com',
  'skeefmail.com',
  'slaskpost.se',
  'slipry.net',
  'slopsbox.com',
  'smashmail.de',
  'soodonims.com',
  'spam.la',
  'spam.su',
  'spam4.me',
  'spamavert.com',
  'spambob.com',
  'spambob.net',
  'spambob.org',
  'spambog.com',
  'spambog.de',
  'spambog.ru',
  'spambox.us',
  'spamcannon.com',
  'spamcannon.net',
  'spamcero.com',
  'spamcon.org',
  'spamcorptastic.com',
  'spamcowboy.com',
  'spamcowboy.net',
  'spamcowboy.org',
  'spamday.com',
  'spamex.com',
  'spamfighter.cf',
  'spamfighter.ga',
  'spamfighter.gq',
  'spamfighter.ml',
  'spamfighter.tk',
  'spamfree.org',
  'spamfree24.com',
  'spamfree24.de',
  'spamfree24.eu',
  'spamfree24.info',
  'spamfree24.net',
  'spamfree24.org',
  'spamgourmet.com',
  'spamgourmet.net',
  'spamgourmet.org',
  'spamherelots.com',
  'spamhereplease.com',
  'spamhole.com',
  'spamify.com',
  'spaminator.de',
  'spamkill.info',
  'spaml.com',
  'spaml.de',
  'spammotel.com',
  'spamobox.com',
  'spamoff.de',
  'spamslicer.com',
  'spamspot.com',
  'spamstack.net',
  'spamthis.co.uk',
  'spamtrail.com',
  'spamtrap.ro',
  'speed.1s.fr',
  'spoofmail.de',
  'stuffmail.de',
  'supergreatmail.com',
  'supermailer.jp',
  'superrito.com',
  'suremail.info',
  'svk.jp',
  'sweetxxx.de',
  'tafmail.com',
  'tagyoureit.com',
  'talkinator.com',
  'tapchicuoihoi.com',
  'teewars.org',
  'teleworm.com',
  'teleworm.us',
  'temp-mail.org',
  'temp-mail.ru',
  'tempail.com',
  'tempalias.com',
  'tempe4mail.com',
  'tempemail.biz',
  'tempemail.co.za',
  'tempemail.com',
  'tempemail.net',
  'tempinbox.com',
  'tempinbox.co.uk',
  'tempmail.eu',
  'tempmail.it',
  'tempmail2.com',
  'tempmaildemo.com',
  'tempmailer.com',
  'tempmailer.de',
  'tempomail.fr',
  'temporarily.de',
  'temporarioemail.com.br',
  'temporaryemail.net',
  'temporaryemail.us',
  'temporaryforwarding.com',
  'temporaryinbox.com',
  'temporarymailaddress.com',
  'tempsky.com',
  'tempthe.net',
  'tempymail.com',
  'thanksnospam.info',
  'thankyou2010.com',
  'thc.st',
  'thecriminals.com',
  'throam.com',
  'throwaway.email',
  'throwawayemailaddress.com',
  'tilien.com',
  'tittbit.in',
  'tmpmail.net',
  'tmpmail.org',
  'toiea.com',
  'toomail.biz',
  'tradermail.info',
  'trash-amil.com',
  'trash-mail.at',
  'trash-mail.com',
  'trash-mail.de',
  'trash2009.com',
  'trashdevil.com',
  'trashdevil.de',
  'trashemail.de',
  'trashmail.at',
  'trashmail.com',
  'trashmail.de',
  'trashmail.me',
  'trashmail.net',
  'trashmail.org',
  'trashmail.ws',
  'trashmailer.com',
  'trashymail.com',
  'trashymail.net',
  'trbvm.com',
  'trbvn.com',
  'trialmail.de',
  'trickmail.net',
  'trillianpro.com',
  'turual.com',
  'twinmail.de',
  'tyldd.com',
  'uggsrock.com',
  'upliftnow.com',
  'uplipht.com',
  'venompen.com',
  'veryreallEmail.com',
  'viditag.com',
  'viewcastmedia.com',
  'viewcastmedia.net',
  'viewcastmedia.org',
  'vomoto.com',
  'vpn.st',
  'vsimcard.com',
  'vubby.com',
  'wasteland.rfc822.org',
  'webemail.me',
  'weg-werf-email.de',
  'wegwerfadresse.de',
  'wegwerfemail.com',
  'wegwerfemail.de',
  'wegwerfmail.de',
  'wegwerfmail.net',
  'wegwerfmail.org',
  'wh4f.org',
  'whatiaas.com',
  'whatpaas.com',
  'whyspam.me',
  'wilemail.com',
  'willhackforfood.biz',
  'willselfdestruct.com',
  'winemaven.info',
  'wronghead.com',
  'wuzup.net',
  'wuzupmail.net',
  'wwwnew.eu',
  'xagloo.com',
  'xemaps.com',
  'xents.com',
  'xjoi.com',
  'xmaily.com',
  'xoxy.net',
  'yep.it',
  'yogamaven.com',
  'yomail.info',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.gq',
  'yopmail.net',
  'yourdomain.com',
  'ypmail.webarnak.fr.eu.org',
  'yuurok.com',
  'zehnminutenmail.de',
  'zippymail.info',
  'zoaxe.com',
  'zoemail.org',
]);

// ── Domain pattern matching ─────────────────────────────────────────────
// Catches disposable services not yet in the explicit blocklist by matching
// common naming patterns used by throwaway email providers.
const SUSPICIOUS_DOMAIN_PATTERNS: RegExp[] = [
  /^temp[_-]?mail/i,
  /^trash[_-]?mail/i,
  /^throw[_-]?away/i,
  /^fake[_-]?(mail|inbox|email)/i,
  /^disposable/i,
  /^spam[_-]?(mail|box|trap|free)/i,
  /^(guerrilla|gorilla)[_-]?mail/i,
  /^junk[_-]?mail/i,
  /^burn(er)?[_-]?(mail|email)/i,
  /^no[_-]?spam/i,
  /^mail[_-]?(temp|trash|junk|fake|drop|null|expire)/i,
  /^wegwerf/i,     // German for "throwaway"
  /^jetable/i,     // French for "disposable"
  /^10minute/i,
  /^20minute/i,
];

/**
 * Returns true if the domain name matches known disposable service naming patterns.
 */
function hasSuspiciousDomainPattern(domain: string): boolean {
  const name = domain.split('.')[0]; // strip TLD
  return SUSPICIOUS_DOMAIN_PATTERNS.some((p) => p.test(name));
}

// ── Bot-generated username detection ────────────────────────────────────
// Bots frequently generate usernames with alternating consonant-vowel
// patterns followed by digits, e.g. "xiweco6478", "rohiwo6197".

const VOWELS = new Set('aeiou');

/**
 * Returns true if the email username looks bot-generated.
 * Catches patterns like: xiweco6478, rohiwo6197, tafiku3812
 */
function looksLikeBotUsername(email: string): boolean {
  const username = email.split('@')[0]?.toLowerCase();
  if (!username || username.length < 6) return false;

  // Pattern 1: 5-8 letters with strict consonant-vowel alternation, then 2+ digits
  // e.g., xiweco6478, rohiwo6197 — but NOT alex2024 (too short to be confident)
  const cvDigitPattern = /^([a-z]{5,8})(\d{2,})$/;
  const match = username.match(cvDigitPattern);
  if (match) {
    const letters = match[1];
    // Check for strict CV alternation (at least 4 consecutive alternations)
    let alternations = 0;
    for (let i = 1; i < letters.length; i++) {
      const prevIsVowel = VOWELS.has(letters[i - 1]);
      const currIsVowel = VOWELS.has(letters[i]);
      if (prevIsVowel !== currIsVowel) {
        alternations++;
      } else {
        alternations = 0; // reset on break
      }
    }
    // 4+ consecutive alternations + trailing digits = very likely bot
    if (alternations >= 4) return true;
  }

  // Pattern 2: random alphanumeric strings with interleaved digits
  // e.g., "k3jf8x2m", "a8b2c4d6" — but NOT "alex2024" (name + year)
  const mixedAlphaNum = /^(?=.*[a-z])(?=.*\d)[a-z\d]{6,}$/;
  if (mixedAlphaNum.test(username)) {
    // Skip if digits are clustered at the end (common "name2024" pattern)
    const endsWithDigits = /^[a-z]+\d+$/.test(username);
    if (!endsWithDigits) {
      const digitRatio = (username.match(/\d/g)?.length ?? 0) / username.length;
      // If 30-70% digits interleaved with letters, likely bot-generated
      if (digitRatio >= 0.3 && digitRatio <= 0.7) return true;
    }
  }

  return false;
}

/**
 * Returns true if the email uses a known disposable/throwaway domain,
 * matches a suspicious domain pattern, or has a bot-generated username.
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  if (DISPOSABLE_DOMAINS.has(domain)) return true;
  if (hasSuspiciousDomainPattern(domain)) return true;
  if (looksLikeBotUsername(email)) return true;
  return false;
}

// ── Timing trap ─────────────────────────────────────────────────────────
const MINIMUM_FILL_TIME_MS = 3_000; // 3 seconds — no human fills a form this fast

/**
 * Records the time a form was rendered. Call on mount.
 * Returns a token used by `isSubmittedTooFast`.
 */
export function markFormLoaded(): number {
  return Date.now();
}

/**
 * Returns true if the form was submitted faster than a human could fill it.
 */
export function isSubmittedTooFast(loadedAt: number): boolean {
  return Date.now() - loadedAt < MINIMUM_FILL_TIME_MS;
}

// ── Rate limiter ────────────────────────────────────────────────────────
const RATE_LIMIT_KEY = 'ra_lead_submissions';
const MAX_SUBMISSIONS = 3;
const RATE_WINDOW_MS = 60 * 60 * 1_000; // 1 hour

interface SubmissionRecord {
  timestamps: number[];
}

function getSubmissionRecord(): SubmissionRecord {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { timestamps: [] };
    return JSON.parse(raw) as SubmissionRecord;
  } catch {
    return { timestamps: [] };
  }
}

function saveSubmissionRecord(record: SubmissionRecord) {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(record));
  } catch {
    // localStorage may be unavailable (private browsing, quota, etc.)
  }
}

/**
 * Returns true if the visitor has exceeded the submission rate limit.
 */
export function isRateLimited(): boolean {
  const now = Date.now();
  const record = getSubmissionRecord();
  const recent = record.timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  return recent.length >= MAX_SUBMISSIONS;
}

/**
 * Records a successful submission for rate-limiting purposes.
 */
export function recordSubmission(): void {
  const now = Date.now();
  const record = getSubmissionRecord();
  const recent = record.timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  saveSubmissionRecord({ timestamps: recent });
}

// ── Aggregate check ─────────────────────────────────────────────────────

export interface SpamCheckResult {
  blocked: boolean;
  reason: string | null;
}

/**
 * Runs all spam checks. Returns `{ blocked: false }` if clean,
 * or `{ blocked: true, reason }` describing what triggered.
 *
 * The `reason` is user-facing — keep it polite and non-specific so
 * attackers can't easily reverse-engineer the rules.
 */
export function runSpamChecks(email: string, formLoadedAt: number): SpamCheckResult {
  if (isSubmittedTooFast(formLoadedAt)) {
    return { blocked: true, reason: 'Please take a moment before submitting.' };
  }
  if (isDisposableEmail(email)) {
    return { blocked: true, reason: 'Please use a work email address — temporary addresses are not accepted.' };
  }
  if (isRateLimited()) {
    return { blocked: true, reason: 'Too many submissions. Please try again later.' };
  }
  return { blocked: false, reason: null };
}
