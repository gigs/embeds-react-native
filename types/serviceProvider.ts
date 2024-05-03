export type ServiceProvider = {
  object: 'serviceProvider'
  id: string
  name: string
  recipientProviders: string[]
}

export type ServiceProviderList = {
  object: 'list'
  items: ServiceProvider[]
}
