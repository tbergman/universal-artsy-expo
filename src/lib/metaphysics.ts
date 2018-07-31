// import { NativeModules } from "react-native"
// const Emission = NativeModules.Emission || {}

import { metaphysicsURL } from "./relay/config"
import { NetworkError } from "./utils/errors"

type Payload = { query: string; variables?: object } | { documentID: string; variables?: object }

export function request(payload: Payload, checkStatus: boolean = true): Promise<Response> {
  return fetch(metaphysicsURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
      "X-USER-ID": "5b45dbd488759114f819ec0b",
      "X-ACCESS-TOKEN":
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YjQ1ZGJkNDg4NzU5MTE0ZjgxOWVjMGIiLCJzYWx0X2hhc2giOiJjMDBjMzEwNTdhMzk0NTBkMWU3ODdjYWM5YjRhYmJhMCIsInJvbGVzIjoidXNlciIsInBhcnRuZXJfaWRzIjpbXSwiZXhwIjoxNTM3MDMzMjUxLCJpYXQiOjE1MzE4NDkyNTEsImF1ZCI6IjRlMzZlZmE0ZGI0ZTMyMDAwMTAwMDM1OSIsImlzcyI6IkdyYXZpdHkiLCJqdGkiOiI1YjRlMmEyM2EzZTA2ZTAwMjIzNGZlYTQifQ.M0F4h87JSYJ9fnpki1iVxXPHtpa5FRj3qzxynBIaF1k",
    },
    body: JSON.stringify(payload),
  }).then(response => {
    if (!checkStatus || (response.status >= 200 && response.status < 300)) {
      return response
    } else {
      const error = new NetworkError(response.statusText)
      error.response = response
      throw error
    }
  })
}

export function metaphysics<T>(payload: Payload, checkStatus: boolean = true): Promise<T> {
  return (
    request(payload, checkStatus)
      .then<T & { errors: any[] }>(response => response.json())
      // TODO: This is here because existing callers may rely on this, but it’s now duplicated here and in fetchQuery.ts
      .then(json => {
        if (json.errors) {
          json.errors.forEach(console.error)
          // Throw here so that our error view gets shown.
          // See https://github.com/facebook/relay/issues/1913
          throw new Error("Server-side error occurred")
        }
        return json
      })
  )
}

export default function query<T>(url: string): Promise<T> {
  return metaphysics<{ data: T }>({ query: url }).then(({ data }) => data)
}
