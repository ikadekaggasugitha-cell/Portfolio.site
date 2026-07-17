import api from './api'
import type { ApiResponse, LoginResponse, User } from '@/types'

export async function loginRequest(
  email: string,
  password: string,
): Promise<ApiResponse<LoginResponse>> {
  const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
    email,
    password,
  })
  return data
}

export async function getMe(): Promise<ApiResponse<User>> {
  const { data } = await api.get<ApiResponse<User>>('/auth/me')
  return data
}

export async function logoutRequest(): Promise<ApiResponse<null>> {
  const { data } = await api.post<ApiResponse<null>>('/auth/logout')
  return data
}

export async function refreshToken(): Promise<ApiResponse<{ token: string }>> {
  const { data } = await api.post<ApiResponse<{ token: string }>>(
    '/auth/refresh',
  )
  return data
}
