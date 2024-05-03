import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

export const apiUrl = 'https://api.gigs.com'
export const apiUrlWithProject = 'https://api.gigs.com/projects/:id'

// When overriding a handler, be careful to only override unique handler URLs
// and not default handlers (eg when overriding subscriptions/:id, specify a unique id => subscriptions/sub_1234),
// as it can otherwise affect concurrent tests.
export const handlers = [
  http.post('https://connect.gigs.com/api/embeds/auth', () => {
    return HttpResponse.json({
      token: {
        access_token: 'test',
        id_token: '12345',
        expires_in: 2000,
        token_type: 'Bearer',
      },
    })
  }),
  http.get('https://api.gigs.com/projects/dev/subscriptions/:id', () => {
    return HttpResponse.json({
      id: 'sub_12345',
      porting: {
        status: 'draft',
      },
    })
  }),
  http.get('https://api.gigs.com/serviceProviders', () => {
    return HttpResponse.json({
      object: 'list',
      items: [
        {
          object: 'serviceProvider',
          id: 'svp_0SNlurA01K6GY5L0XJffY8',
          name: 'AT&T',
          recipientProviders: ['p3'],
        },
      ],
      moreItemsAfter: null,
      moreItemsBefore: null,
    })
  }),
]

export const server = setupServer(...handlers)
export { http, HttpResponse }
