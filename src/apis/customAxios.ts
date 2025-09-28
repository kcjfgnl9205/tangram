const AWS_S3_ENDPOINT = 'https://cdn.playtangram.com'
export const getResourceUrl = (path: string) => `${AWS_S3_ENDPOINT}/${path}`
