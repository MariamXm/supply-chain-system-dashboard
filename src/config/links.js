const env = import.meta.env
const clean = (v) => (typeof v === 'string' ? v.trim() : '')

export const CONTRACT_ADDRESS = clean(env.VITE_CONTRACT_ADDRESS)

/** Console / dashboard pages opened in a new tab by the presenter. Empty = no link shown. */
export const LINKS = {
  iotCore: clean(env.VITE_IOT_CORE_URL),
  lambda: clean(env.VITE_LAMBDA_URL),
  lambdaLogs: clean(env.VITE_LAMBDA_LOGS_URL),
  pinata: clean(env.VITE_PINATA_URL),
}

export const etherscanAddressUrl = () =>
  CONTRACT_ADDRESS ? `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}` : ''
export const etherscanEventsUrl = () => (CONTRACT_ADDRESS ? `${etherscanAddressUrl()}#events` : '')

export const GOOGLE_MAPS_KEY = clean(env.VITE_GOOGLE_MAPS_API_KEY)
