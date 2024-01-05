// Making this file a module to avoid global scope defined variables
export {}

//=============== Types, Classes and Interfaces ===============

interface RequestValidation {
  handle(): Response
  setNext(next: RequestValidation): void
}

type Role = 'admin' | 'hr'

const RESOURCES: Record<string, {title: string, role: Role}> = {
  '/resources/1': {
    title: 'Super secret document',
    role: 'admin'
  },
  '/resources/2': {
    title: 'Payroll',
    role: 'hr'
  }
}

class BaseRequestValidation implements RequestValidation {
  protected next?: RequestValidation
  protected readonly request: Request
  protected readonly resourceUrl: string

  constructor(request: Request) {
    this.request = request
    this.resourceUrl = this.request.url
  }

  protected createResponse(response: string | Object, status: number = 200): Response {
    const json = typeof response === 'object'
      ? JSON.stringify(response) 
      : JSON.stringify({ message: response })

    return new Response(json, { status })
  }

  protected getCredentials(): { user: string, password: string } {
    const searchParams = new URL(this.request.url).searchParams

    return {
      user: decodeURI(searchParams.get('user') || ''),
      password: decodeURI(searchParams.get('password') || '')
    }
  }

  protected getResource(): typeof RESOURCES[keyof typeof RESOURCES] | null {
    const { pathname: resourceId } = new URL(this.resourceUrl)
    return RESOURCES[resourceId] || null
  }

  setNext(next: RequestValidation): RequestValidation {
    this.next = next
    return this.next
  }

  handle(): Response {
    if (this.next) {
      return this.next.handle()
    }

    return this.createResponse('Error', 500)
  }
}

const USERS: Record<string, { password: string, role: Role }> = {
  '4dm1n': {
    password: 'p455w0rd',
    role: 'admin'
  },
  'u53r': {
    password: '123456',
    role: 'hr'
  }
}

class Authentiaction extends BaseRequestValidation {
  handle(): Response {
    const { user, password } = this.getCredentials()
    if (!USERS[user] || USERS[user].password !== password) {
      return this.createResponse('Incorrect username or password', 400)
    }
    
    if (this.next) {
      return this.next.handle()
    }

    return this.createResponse('User authenticated', 200)
  }
}

class Authorization extends BaseRequestValidation {
  handle(): Response {
    const { user } = this.getCredentials()
    const { pathname: docId } = new URL(this.request.url)
    const userRole = USERS[user].role

    if (!docId) return this.createResponse('Invalid resource', 400)

    const resource = this.getResource()

    if (!resource) return this.createResponse('Resource not found', 404)

    if (userRole === 'admin' || resource.role === userRole) {

      if (this,this.next) {
        return this.next.handle()
      }

      return this.createResponse('User has access to resource', 200)
    }

    return this.createResponse('User has no access to this resource', 403)
  }
}

class Resource extends BaseRequestValidation {
  handle(): Response {
    const resource = this.getResource()

    if (!resource) {
      return this.createResponse('Resource not found', 404)
    }

    return this.createResponse(resource, 200)
  }
}

class ResourceManager {
  static getResource(request: Request): Response {
    const authenticationHandler = new Authentiaction(request)

    authenticationHandler.setNext(
      new Authorization(request)
    ).setNext(
      new Resource(request)
    )

    return authenticationHandler.handle()
  }
}

//============================================================

//=============== Functions ===============

function createRequest(path: string, user: string, password: string) {
  return new Request(`http://localhost${encodeURI(path)}?user=${encodeURI(user)}&password=${encodeURI(password)}`)
}

async function clientCode() {
  // inconming request...
  const adminRequest = createRequest('/resources/1', '4dm1n', 'p455w0rd')
  const hrSucessfulRequest = createRequest('/resources/2', 'u53r', '123456')
  const hrErrorRequest = createRequest('/resources/1', 'u53r', '123456')
  const invalidCredentialsRequest = createRequest('/resources/1', 'someuser', 'wiejfow')

  const adminResponse = ResourceManager.getResource(adminRequest)
  const adminResult = await adminResponse.json()
  console.log({adminResult})

  const hrSucessfulResponse = ResourceManager.getResource(hrSucessfulRequest)
  const hrSucessfulResult = await hrSucessfulResponse.json()
  console.log({hrSucessfulResult})

  const hrErrorResponse = ResourceManager.getResource(hrErrorRequest)
  const hrErrorResult = await hrErrorResponse.json()
  console.log({hrErrorResult})

  const invalidCredentialsResponse = ResourceManager.getResource(invalidCredentialsRequest)
  const invalidCredentialsResult = await invalidCredentialsResponse.json()
  console.log({invalidCredentialsResult})
}

//============================================================

clientCode()