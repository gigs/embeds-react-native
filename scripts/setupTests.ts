import '@testing-library/react-native/extend-expect'

import { server } from '../testing/http'

// Spin up msw http mocks
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

jest.setTimeout(15000)

jest.useFakeTimers() // this is needed to fix `act` warnings caused by animations
