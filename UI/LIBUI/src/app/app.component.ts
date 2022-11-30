import { Component, OnInit } from '@angular/core';
import { setToast, sleep } from './classes/Toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'LibUI';


  async ngOnInit(): Promise<void> {
    let t = document.getElementById('toast');
    let prev: string;
    if (t != null)
      prev = t.style.display;
    if (t != null)
      t.style.display = 'none';

    setToast(async (config: any) => {
      let duration = 2;
      let text = 'sample text';


      console.log('toast happened');



      if (config) {

        if (config.duration)
          duration = config.duration;
        if (config.text)
          text = config.text;
      }

      if (t != null) {
        t.style.display = 'inline';

        t.style.display = prev;
        t.style.opacity = '0';

        for (let i = 0; i < 100; i++) {
          let opacity = i / 100;
          let dur = (duration / 2) / 100;

          sleep(300*i).then(() => {
            if (t != null)
              t.style.opacity = `${opacity}`;
            
          });
        }

        await sleep(3000);
        t.style.opacity = '0';
      }
    });
  }
}
