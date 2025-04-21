import { LightningElement } from 'lwc';
import getTrainDetails from '@salesforce/apex/TrainDetails.getTrainDetails';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'Station Name', fieldName: 'station_name' },
    { label: 'Distance', fieldName: 'distance'},
	{ label: 'Halt', fieldName: 'halt' },
    { label: 'Delay', fieldName: 'delay' },
    { label: 'Platform', fieldName: 'platform' },
	{ label: 'Timing', fieldName: 'timing'},
		
];

export default class TrainDetails extends LightningElement {
		
		inputTrainNo = '';
		showTrainDetails = false;
		Cancelbtn = false;
		showSpinner = false;
		trainDetails = {};
		columns = columns;
		error = false
		message = ' ';
		
		handleInputChange(event){
				this.inputTrainNo = event.detail.value;
		}
		
		handleTrainInfo(){
				getTrainDetails({trainNo : this.inputTrainNo})
				.then((result) => {
					if(Object.keys(result).length > 0){
						this.showTrainDetails = true;
						this.Cancelbtn = true;
						this.trainDetails = result;
						if(this.trainDetails.message === ""){
                               this.message = 'This train is not started yet';
						}else{
							   this.message = this.trainDetails.message;
						}
						console.log('trainDetails '+JSON.stringify(this.trainDetails));
					}
					else{
							const event = new ShowToastEvent({
							title: 'Invalid Train Number',
							message: 'No trains exist with train number '+this.inputTrainNo,
							variant: 'error',
							mode: 'dismissable'
							});
							this.dispatchEvent(event);
					}
						
				})
				.catch((error) =>{
						this.showSpinner = true;
						setTimeout(() => {
							this.showSpinner = false;
						},5000)
						setTimeout(() => {
                            this.error = true
						},5025)
						console.log('Some error occurred while fetching train details'+JSON.stringify(error));
				});
		}

		handleReset(){
				this.inputTrainNo = ' ';
				this.error = false;
		}
		handleCancel(){
			this.showTrainDetails = false;
			this.Cancelbtn = false;
			this.inputTrainNo = ' '
		}
}
