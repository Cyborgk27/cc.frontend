import { Component, inject, signal } from '@angular/core';
import { DashboardService } from '../../../../core/api';
import { AuthState } from '../../../../core/services/auth-state';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalApiKeys: number;
  totalAssignedCatalogs: number;
  catalogsPerProject: { projectName: string; catalogCount: number }[];
  recentActivity: { entityName: string; action: string; date: string }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private dashboardService = inject(DashboardService);
  private authState = inject(AuthState);

  public userFullName = this.authState.userFullName;
  public stats = signal<DashboardStats | null>(null);
  public isLoading = signal(true);

  ngOnInit() {
    this.dashboardService.apiDashboardStatsGet().subscribe({
      next: (res) => {
        if (res.isSuccess) this.stats.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
