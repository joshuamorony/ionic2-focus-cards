import { Directive, ContentChildren, Renderer, ElementRef } from '@angular/core';
import { Card, DomController, Platform } from 'ionic-angular';
import { ThreeDeeTouch } from '@ionic-native/three-dee-touch';

@Directive({
 	selector: '[focusCards]',
	host: {
		'(ionScroll)': 'onContentScroll($event)',
		'(touchstart)': 'resetStyle()'
	}
})
export class FocusCards {

	@ContentChildren(Card, {read: ElementRef}) cards;
	tappedCard: any;
	focusedCard: boolean = false;

	scrollTop: number = 0;

	constructor(public renderer: Renderer, public element: ElementRef, public domCtrl: DomController, public threeDee: ThreeDeeTouch, public platform: Platform) {

	}

	ngAfterViewInit(){

		this.platform.ready().then(() => {
			this.threeDee.watchForceTouches().subscribe(data => {

				this.cards.forEach((card) => {
	
					let offset = card.nativeElement.offsetParent.offsetTop + card.nativeElement.offsetTop;

					if(data.y > offset - this.scrollTop && data.y < offset + card.nativeElement.offsetHeight - this.scrollTop){
						this.tappedCard = card;
						this.onPress();
					}
				});

			});
		});

	}

	onContentScroll(ev){
		this.scrollTop = ev.scrollTop;
	}

	onPress(){

		this.focusedCard = true;
		
		this.domCtrl.write(() => {
			this.cards.forEach((card) => {
				if(card !== this.tappedCard){
					this.domCtrl.write(() => {
						this.renderer.setElementStyle(card.nativeElement, 'opacity', '0.4');
					});
				}
			});			
		});

	}

	resetStyle(){

		this.focusedCard = false;

		this.cards.forEach((card) => {
			this.domCtrl.write(() => {
				this.renderer.setElementStyle(card.nativeElement, 'opacity', '1');
			});
		});

	}

}