import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading-service.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent {
  isLoading: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.isLoading = this.loadingService.loading$;
  }
}
