import { animate, group, query, state, style, transition, trigger } from '@angular/animations';

export const routerAnimationDuration = 500;

export function createTransition(backwards = false): any {
  return [
    query(':enter, :leave', style({ position: 'fixed' })
    , { optional: true }),
    group([
      query(':enter', [
        style({ transform: backwards ? 'translateX(-100%)' : 'translateX(100%)' }),
        animate(routerAnimationDuration + 'ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate(routerAnimationDuration + 'ms ease-in-out', style({ transform: backwards ? 'translateX(100%)' : 'translateX(-100%)' }))
      ], { optional: true }),
    ])
  ];
}

export const dashboardTransition = trigger('dashboardTransition', [
  transition(':enter', [
    style({ transform: true ? 'translateX(-100%)' : 'translateX(100%)' }),
    animate(routerAnimationDuration + 'ms ease-in-out', style({ transform: 'translateX(0%)' }))
  ]),
  transition(':leave', [
    style({ transform: 'translateX(0%)' }),
    animate(routerAnimationDuration + 'ms ease-in-out', style({ transform: true ? 'translateX(100%)' : 'translateX(-100%)' }))
  ])
]);

export const pageRouterTransition = trigger('routerTransition', [
  transition('* => rightB', createTransition()),
  transition('* => rightA', createTransition()),
  transition('* => leftA', createTransition(true)),
  transition('* => leftB', createTransition(true))
]);

export const footerRouterTransition = trigger('footerRouterTransition', [
  state('enter', style({
    opacity: 1,
    // transform: 'translateY(0)'
  })),
  transition('* => enter', [
    style({transform: 'translateY(100%)', opacity: 0, position: 'absolute'}),
    animate('500ms', style({transform: 'translateY(0)', opacity: 1})),
    style({opacity: 0, display: 'block'}),
  ]),
  transition('* => leave', [
    style({opacity: 0, display: 'none'}),
    animate('0ms', style({opacity: 0, display: 'none'})),
  ]),
  // state('leave', style({
  //   opacity: 0,
  //   display: 'none',
  //   // transform: 'translateY(100%)'
  // })),
]);

export const downTransition = trigger('downTransition', [
  transition('void => up', [
    style({transform: 'translateY(140%)'}),
    animate('500ms')
  ]),
  transition('up => void', [
    style({transform: 'translateY(0%)'}),
    animate('500ms', style({transform: 'translateY(-140%)'}))
  ]),
  transition('void => down', [
    style({transform: 'translateY(-140%)'}),
    animate('500ms')
  ]),
  transition('down => void', [
    style({transform: 'translateY(0%)'}),
    animate('500ms', style({transform: 'translateY(140%)'}))
  ])
]);

export const inOutTransition = trigger(
  'inOutAnimation',
  [
    transition(
      ':enter',
      [
        style({ opacity: 0 }),
        animate('0.5s ease-in')
      ]
    )
  ]
);

export const visibilityTransition =  trigger('visibilityTransition', [
  state('visible', style({opacity: 1})),
  state('hidden', style({opacity: 0})),
  transition('* => visible', [animate('0.5s')]),
  transition('* => hidden', [animate('0.5s')])
]);

export const miloEnterLeaveTransition = trigger('miloEnterLeaveTransition', [
  transition('void => appearing', [
    style({opacity: 0}),
    animate('1s 0.5s ease-in', style({opacity: 1}))
  ]),
  transition('appearing => void', [
    animate('0.5s 0s ease-out'),
    style({opacity: 0})
  ]),
  transition('void => right-to-left', [
    style({transform: 'translate(120%, -100%)'}),
    animate('1000ms 0ms ease-in', style({transform: 'translate(0, -100%)'})),
  ]),
  transition('right-to-left => void', [
    animate('1000ms 0ms ease-in', style({transform: 'translateX(-120%)'})),
  ]),
  transition('void => bottom-to-top', [
    style({transform: 'translateY(20%)'}),
    animate('1000ms 0ms ease-in', style({transform: 'translateY(-100%)'})),
  ]),
  transition('bottom-to-top => void', [
    animate('1000ms 0ms ease-in', style({transform: 'translateY(-120%)'})),
  ]),
]);
