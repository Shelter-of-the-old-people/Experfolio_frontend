// 라우트 정의
export const routes = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  SIGNUP_COMPANY: '/signup/company',
  SIGNUP_STUDENT: '/signup/student',
  
  // Company routes
  SEARCH: '/search',
  SEARCH_RESULTS: '/search/results',
  TALENT_DETAIL: '/talent/:id',
  
  // Student routes
  PORTFOLIO: '/portfolio',
  PORTFOLIO_EDIT: '/portfolio/edit',
  
  // Common authenticated routes
  PROFILE: '/profile',
  
  // Dev routes
  STYLE_GUIDE: '/style-guide',
  
  // Error routes
  NOT_FOUND: '/404'
};