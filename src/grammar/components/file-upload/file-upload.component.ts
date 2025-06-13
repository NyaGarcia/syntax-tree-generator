import { Component, EventEmitter, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SampleFileService } from '../../services/sample-file.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Output() selectedFile = new EventEmitter<File>();
  isDragging = false;
  fileList: File[] = [];
  errorMessage: string;

  constructor(private sampleFileService: SampleFileService) {}

  downloadGrammar() {
    this.sampleFileService.downloadSampleFile();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files);

      this.validate(files);
    }
  }

  onFileSelect(event: Event): void {
    const { files } = event.target as HTMLInputElement;
    if (!files || files.length === 0) return;

    this.validate(Array.from(files));
  }

  removeFile(index: number): void {
    this.fileList.splice(index, 1);
  }

  emitFile(index: number): void {
    this.selectedFile.emit(this.fileList[index]);
  }

  private validate(files: File[]) {
    const jsonFiles = files.filter(
      (file) =>
        file.type === 'application/json' ||
        file.name.toLowerCase().endsWith('.json')
    );

    if (jsonFiles.length === 0) {
      this.errorMessage = 'Solo se permiten ficheros JSON';
    } else {
      this.errorMessage = '';
      this.fileList = [...this.fileList, ...jsonFiles];
    }
  }
}
