import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Typed from 'typed.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'PortfolioWeb';
  gmail='bilalsoftengr@gmail.com'
  ngOnInit(): void {
    const options = {
      strings: ['Entrepreneur', 'Software Engineer', 'C#/Dot Net Developer','Full Stack Developer','Mean Stack Developer', 'Web Developer', 'Front End Developer', 'Back End Developer', 'Angular | React | JavaScript | SQL Server | Bootstrap ', ' AWS | Azure | Kentico',],
      typeSpeed: 30, // Speed in milliseconds
      backSpeed: 25,  // Speed in milliseconds
      backDelay: 1000, // Delay before starting to backspace
      startDelay: 500, // Delay before starting typing
      loop: true, // Loop the animation
      showCursor: true, // Show blinking cursor
    };

    const typed = new Typed('.typed-text', options);
  }

  downloadCV(): void {
    const link = document.createElement('a');
    link.href = '/assets/Bilal_CV.pdf';  // Path to the PDF file
    link.download = 'Bilal_CV.pdf';     // Default name of the file to be downloaded
    link.click();
  }

  scrole: string = 'https://scrole.com';
  ODTool: string = 'https://quote.odysseydesignco.com/home';
  Linkcenter: string = 'http://www.links.center/';
  Eurobank: string = 'https://ssp.eurobank.com.cy/account/login';
  Cloudoor: string = 'https://cloudoor.com/';
  Medikea: string = 'https://www.medikea.co.tz/';

  copyscrole(): void {
    navigator.clipboard.writeText(this.scrole).then(() => {
      // Optional: Display a message or toast notification
      alert('scrole Website link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
  copyODTool(): void {
    navigator.clipboard.writeText(this.ODTool).then(() => {
      // Optional: Display a message or toast notification
      alert('ODTool Website link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
  copyLinkcenter(): void {
    navigator.clipboard.writeText(this.Linkcenter).then(() => {
      // Optional: Display a message or toast notification
      alert('Linkcenter Website link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
  copyEurobank(): void {
    navigator.clipboard.writeText(this.Eurobank).then(() => {
      // Optional: Display a message or toast notification
      alert('Eurobank Website link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
  copyCloudoor(): void {
    navigator.clipboard.writeText(this.Cloudoor).then(() => {
      // Optional: Display a message or toast notification
      alert('Cloudoor Website link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }
  copyMedikea(): void {
    navigator.clipboard.writeText(this.Medikea).then(() => {
      // Optional: Display a message or toast notification
      alert('Medikea Website link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }


  phoneNumber = '+923456466188';  // Replace with the desired phone number

  openWhatsApp() {
    // Construct the URL to open WhatsApp with a pre-filled message
    const url = `https://wa.me/${this.phoneNumber}`;
    window.open(url, '_blank');
  }

  
}
