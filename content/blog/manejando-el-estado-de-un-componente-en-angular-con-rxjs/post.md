---
image: ./main.png
title: Manejando el estado de un componente en Angular con RxJS
author: Santigo Marcano
date: 05/19/2019
punchline: Manejar el estado de los datos en el mundo web moderno es una tarea compleja que debe ser realizada con cautela. Actualizar el estado de los datos de un componente en Angular ofrece muchas posibilidades gracias a la potencia de RxJS. Existen formas sencillas de realizar esta tarea sin la necesidad de utilizar BehaviorSubject.
tags: Redo, Bledo, Angular
---

Sin duda, la primera vez que nos topamos con RxJS podemos sentirnos desconcertados con todos sus operadores y su filosofía del "stream de datos" pero una vez te empapas bien, puedes darte cuenta de lo trivial que se vuelve manejar procesos asíncronos con esta increíble libreria.

Por cierto... ¿Sabes que `Observable` como tipo nativo es una propuesta formal en [Ecma TC39](https://github.com/tc39/proposal-observable/blob/master/README.me)?

Manejar el estado de un componente en Angular es un completo placer con el uso de esta librería. Veamos un pequeño ejemplo.

En este artículo desarrollaremos una aplicación de stock de instrumentos de una tienda musical, que simulará una peticion con un array de objetos y veremos como manejar cambios en el estado del componente utilizando `Observables` y `ReactiveForms`.

En este artículo no haremos uso de `BehaviorSubject` ya que no es en lo absoluto necesario.

## Lo básico

Primero, vamos a crear el servicio que simulará la peticion con datos codificados en el mismo servicio y una pequeña interfaz para saber como será el modelo de los datos.

Creamos el archivo con nuestra interface 

```TS / instruments.interface.ts
export interface Instrument {
    id: number;
    category: string;
    price: number;
    madeIn: string;
}
```

Algunos datos codificados para simular la petición.

```TS / data.service.ts
@Injectable({
  providedIn: 'root'
})
export class DataService {

  MOCK_DATA: Instrument[] = [
    { id: 1, category: 'Guitar', price: 1000, madeIn: 'Spain' },
    { id: 2, category: 'Bass', price: 200, madeIn: 'China' },
    { id: 3, category: 'Piano', price: 370, madeIn: 'China' },
    { id: 4, category: 'Drum Kit', price: 660, madeIn: 'Japan' }
  ]

}
```

Utilizaremos una variable de cache en la que almacenaremos los datos. Si esta variable existe en memoria, no repetimos la petición.

```TS / data.service.ts
cached: Instrument[] = null;

getData(): Observable<Instrument[]> {
    if (this.cached !== null) {
        return this.refreshFromCache()
    } 
    this.cached = this.MOCK_DATA;
    return of(this.MOCK_DATA);
} 

refreshFromCache(): Observable<Instrument[]> {
    return of(this.cached);
}
```

El método `getData()` simplemente retorna un `Observable` que emitirá la lista a quien se suscriba a él. `refreshFromCache()` devolverá lo que ya esté almacenado en memoria.

Ya tenemos lo básico en el servicio para desplegar los datos en un componente. Desarrollemos un poco el componente.

## Construyendo el componente

Tendremos que inyectar el servicio `DataService` en nuestro componente, crear una tabla para desplegar los datos y definir un formulario para modificarlos.

```TS / app.component.ts
export class AppComponent implements OnInit {

  instruments$: Observable<Instrument[]>
  instrumentForm: FormGroup
  openForm = false;

  constructor(private dataService: DataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.instruments$ = this.dataService.getData();
    this.instrumentForm = this.fb.group({
      id: new FormControl(),
      category: new FormControl(),
      price: new FormControl(),
      madeIn: new FormControl()
    })
  }
}
```

1. `instrument$` será el encargado de suscribirse y proveer de datos el template.

1. `instrumentForm` será el `ReactiveForm` encargado de cargar los datos en demanda.

1. `openForm` es un simple flag para abrir y cerrar el formulario.

Necesitaremos un método para cargar de datos el formulario con la entrada que el usuario desee modificar y un toggler para renderizar y esconder el formulario

```TS / app.component.ts
loadForm(instrument: Instrument): void {
    this.toggleForm();
    this.instrumentForm.setValue({
      id: instrument.id,
      category: instrument.category,
      price: instrument.price,
      madeIn: instrument.madeIn
    })
}

toggleForm(): void {
    this.openForm ? this.openForm = false : this.openForm = true;
}
```

Ya que tenemos toda la lógica necesaria para desplegar datos en nuestro componente, creamos el template

```HTML / app.component.html
 <h1>Instruments Stock</h1>
    <table>
      <tr>
        <th>Category</th>
        <th>Price</th>
        <th>Made In</th>
      </tr>
      <tr *ngFor="let instrument of instruments$ | async">
        <td>{{ instrument.category }}</td>
        <td>{{ instrument.price | currency:'USD' }}</td>
        <td>{{ instrument.madeIn }}</td>
        <td><button (click)="loadForm(instrument)">EDIT</button></td>
        <td><button>REMOVE</button></td>
      </tr>
    </table>
    <br>
    <div *ngIf="openForm">
      <form [formGroup]="instrumentForm" (ngSubmit)="update(instrumentForm.value)">
        <input placeholder="ID" formControlName="id" [attr.disabled]="true">
        <input placeholder="Category" formControlName="category">
        <input placeholder="Price" formControlName="price">
        <input placeholder="Made In" formControlName="madeIn">
        <div>
          <button type="submit">OK</button>
          <button type="button" (click)="toggleForm()">CANCEL</button>
        </div>
      </form>
    </div>
```

Manejamos la suscripción a `instruments$` con el `async pipe` para no tener que desuscribirnos manualmente. Los datos obtenidos con la suscripción los renderizamos en la tabla usando interpolación. 

También construimos un pequeño formulario para poder cargar cada entrada de la tabla y editarla a demanda (idílicamente el formulario debería ser un componente extra pero por simplicidad de este artículo lo creamos en el mismo componente)

Como puedes ver también hay un botón para remover la entrada y el método `update()` que se dispara al enviar el formulario.

Hasta aquí, ya se desplegaría la lista entera codificada en nuestro servicio `DataService`

## Actualizando el estado

En la parte anterior, hicimos un bind por evento click al método `update()` en el template. Este método recibe el valor del formulario y se encarga de hacer la llamada al servicio `DataService`. Debemos crear un método en el servicio que se encargue de actualizar la lista y retornarla.

```TS / app.component.ts

update(instrumentForm: Instrument): void {
    this.toggleForm();
    this.instruments$ = this.dataService.putInstrument(instrumentForm);
}

```

Ahora definimos `putInstrument()`, para filtrar el item anterior de la lista almacenada en memoria utilizando su ID, luego de haber filtrado, insertamos el item modificado a la misma lista y la retornamos como un `Observable` usando `refreshFromCache()`

```TS / data.service.ts 

putInstrument(instrument: Instrument): Observable<Instrument[]> {
    this.cached = cachedData.filter(item => item.id !== instrument.id)
    this.cached.push(instrument);
    return this.refreshFromCache();
}

```

De esta forma el componente se actualiza correctamente ya que el `Observable` al que esta suscrito la tabla en el template del componente con el `async pipe` emitirá el nuevo valor proporcionado por el retorno de `putInstrument()`

Ahora solo nos quedaría poder remover elementos que funciona con la misma lógica pero esta vez, no insertamos nada a la lista, simplemente la filtramos.

Método disparado por el botón del template en el componente.

```TS / app.component.ts
remove(instrumenForm: Instrument) {
    this.instruments$ = this.dataService.removeInstrument(instrumenForm);
}
```

Implementación en el servicio.

```TS / data.service.ts
removeInstrument(instrument: Instrument): Observable<Instrument[]> {
    this.cached = this.filterData(this.cached, instrument)
    return this.refreshFromCache();
}
```

Si queremos implementar la funcionalidad para añadir registros es tan sencillo como utilizar el mismo formulario del componente pero llamar a un método para añadir registros que solo inserte registros en la lista y retorne `refreshFromCache()`

De esta forma manejamos sencillamente con el uso de Observables el estado de los datos de un componente. Esta misma idea se podría extrapolar a todo un modulo que comparta la misma "tienda de datos".

El código completo de este artículo lo puedes encontrar en Stackbliz publicado y probarlo tu mismo. 

Gracias por leer el artículo y espero te haya aportado algo!
