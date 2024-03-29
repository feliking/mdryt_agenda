export default [
  ...applyRules(['guest'], [
    { path: '', component: require('$comp/auth/AuthWrapper').default, redirect: { name: 'login' }, children:
      [
        { path: '/login', name: 'login', component: require('$comp/auth/login/Login').default },
        { path: '/register', name: 'register', component: require('$comp/auth/register/Register').default },
        { path: '/password', component: require('$comp/auth/password/PasswordWrapper').default, children:
          [
            { path: '', name: 'forgot', component: require('$comp/auth/password/password-forgot/PasswordForgot').default },
            { path: 'reset/:token', name: 'reset', component: require('$comp/auth/password/password-reset/PasswordReset').default }
          ]
        }
      ]
    },
  ]),
  ...applyRules(['auth'], [
    { path: '', component: require('$comp/admin/AdminWrapper').default, children:
      [
        { path: '', name: 'index', redirect: { name: 'agenda' } },
        { path: 'profile', component: require('$comp/admin/profile/ProfileWrapper').default, children:
          [
            { path: '', name: 'profile', component: require('$comp/admin/profile/Profile').default },
            { path: 'edit', name: 'profile-edit', component: require('$comp/admin/profile/edit/ProfileEdit').default }
          ]
        },
        { path: 'lugares', name: 'lugar', component: require('$comp/admin/lugar/Index').default },
        { path: 'sectores', name: 'sector', component: require('$comp/admin/sector/Index').default },
        { path: 'delegados', name: 'delegado', component: require('$comp/admin/delegado/Index').default },
        { path: 'eventos', name: 'evento', component: require('$comp/admin/evento/Index').default },
        { path: 'instituciones', name: 'institucion', component: require('$comp/admin/institucion/Index').default },
        { path: 'agenda', name: 'agenda', component: require('$comp/admin/agenda/Index').default}
      ]
    },
  ]),
  { path: '*', redirect: { name: 'agenda' } }
]

function applyRules(rules, routes) {
  for (let i in routes) {
    routes[i].meta = routes[i].meta || {}

    if (!routes[i].meta.rules) {
      routes[i].meta.rules = []
    }
    routes[i].meta.rules.unshift(...rules)

    if (routes[i].children) {
      routes[i].children = applyRules(rules, routes[i].children)
    }
  }

  return routes
}
