import {
  animate,
  AnimationTransitionMetadata,
  group,
  query,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

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
    style({transform: 'translateY(100%)', opacity: 0, position: 'absolute', display: 'block'}),
    animate('500ms', style({transform: 'translateY(0)', opacity: 1})),
    style({opacity: 0, display: 'block'}),
  ]),
  transition('* => leave', [
    style({opacity: 0, display: 'none'}),
    animate('0ms', style({opacity: 0})),
    style({display: 'none'})
  ]),
  // state('leave', style({
  //   opacity: 0,
  //   display: 'none',
  //   // transform: 'translateY(100%)'
  // })),
]);

export const inOutTransition = trigger('inOutAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.5s ease-in')
  ])
]);

export const appearingTransition = trigger('appearingTransition', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('1s ease-in')
  ]),
  transition(':leave', [
    animate('0.5s ease-out', style({ opacity: 0 }))
  ])
]);

export const homeSliderTransition = trigger('homeSliderTransition', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('6s linear', style({ transform: 'translateX(0%)' })),
  ])
]);

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

export type MiloTransitionType = 'appearing' | 'right-to-left' | 'bottom-to-top';

export class MiloTransition {

  constructor(
    private name: string,
    private timings = '500ms',
    private startOpacity = '0',
    private transitions: AnimationTransitionMetadata[] = []
  ) {
  }

  build() {
    return trigger(this.name, this.transitions);
  }

  allSides(timings?: string) {
    return this.up(timings).down(timings).right(timings).left(timings);
  }

  vertical(timings?: string) {
    return this.up(timings).down(timings);
  }

  horizontal(timings?: string) {
    return this.right(timings).left(timings);
  }

  up(timings?: string) {
    this.transitions.push(
      transition('* => up', [
        style({transform: 'translateY(140%)', opacity: this.startOpacity}),
        animate(timings || this.timings)
      ])
    );
    return this;
  }

  down(timings?: string) {
    this.transitions.push(
      transition('* => down', [
        style({transform: 'translateY(-140%)', opacity: this.startOpacity}),
        animate(timings || this.timings)
      ])
    );
    return this;
  }

  right(timings?: string) {
    this.transitions.push(
      transition('* => right', [
        style({transform: 'translateX(-140%)', opacity: this.startOpacity}),
        animate(timings || this.timings)
      ])
    );
    return this;
  }

  left(timings?: string) {
    this.transitions.push(
      transition('* => left', [
        style({transform: 'translateX(140%)', opacity: this.startOpacity}),
        animate(timings || this.timings)
      ])
    );
    return this;
  }

  upVoid(timings?: string) {
    this.transitions.push(
      transition('up => void', [
        style({transform: 'translateY(0%)'}),
        animate(timings || this.timings, style({transform: 'translateY(-140%)', opacity: this.startOpacity}))
      ])
    );
    return this;
  }

  downVoid(timings?: string) {
    this.transitions.push(
      transition('down => void', [
        style({transform: 'translateY(0%)'}),
        animate(timings || this.timings, style({transform: 'translateY(140%)', opacity: this.startOpacity}))
      ])
    );
    return this;
  }

}
