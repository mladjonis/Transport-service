export class DeleteMenu extends google.maps.OverlayView {
    div_: any;
    divListener_: any;
    mapp: any;
    marker: any;
    markersOnSelectedLine: any;
    linePointsOnSelectedLine: any;
    constructor(map: any, marker: any, markersOnSelectedLine: any, linePoints: any) {
        super();
        this.mapp = map;
        this.marker = marker;
        this.markersOnSelectedLine = markersOnSelectedLine;
        this.linePointsOnSelectedLine = linePoints;
        this.div_ = document.createElement('div');
        this.div_.className = 'delete-menu';
        //top: -160.5px;        left: 249.313px;       position: relative; 
        this.div_.style = "position:absolute;       background: white;       padding: 3px;    color: #666;font-weight: bold;border: 1px solid #999;font-family: sans-serif;font-size: 12px;box-shadow: 1px 3px 3px rgba(0, 0, 0, .3);margin-top: -10px;margin-left: 10px;cursor: pointer;display: inline-block;"
        this.div_.innerHTML = 'Delete';
        google.maps.event.addDomListener(this.div_, 'click', ()=> {
            this.removeVertex();
        });
    }

    onAdd() {
        this.getPanes().floatPane.appendChild(this.div_);
        let path = this.get('path');
        let vertex = this.get('vertex');
        let position = this.get('position');
        
        // mousedown anywhere on the map except on the menu div will close the
        // menu.
        this.divListener_ = google.maps.event.addDomListener(this.mapp.getDiv(), 'mousedown', e=> {
          if (e.target != this.div_) {
            this.close();
          } else {
            if(this.marker == true) {
                if(e.target == this.div_) {
                    this.div_.style.display = "none";
                    let idxForDelete = this.markersOnSelectedLine.findIndex(x=>x.position.lat() == path.position.lat() && x.position.lng() == path.position.lng());
                    this.markersOnSelectedLine.splice(idxForDelete,1);
                    let helpArray = new Array<any>();
                    this.markersOnSelectedLine.forEach(item=>{
                        helpArray.push(`${item.getTitle()},${item.getPosition().lat()},${item.getPosition().lng()}`);
                    });
                    localStorage.setItem('markers',JSON.stringify(helpArray));
                    if(position.lat() && position.lng()) {
                        path.setMap(null);
                    }
                    path.setMap(null);
                    this.close();
                }
            }
          }
        }, true);
    };

    onRemove() {
        google.maps.event.removeListener(this.divListener_);
        this.div_.parentNode.removeChild(this.div_);
    
        // clean up
        this.set('position',null);
        this.set('path',null);
        this.set('vertex',null);
    };

    close() {
        this.setMap(null);
    };

    draw() {
        let position = this.get('position');
        let projection = this.getProjection();

    
        if (!position || !projection) {
            console.log('ajme mene grdan sam ti ja ');
          return;
        }
    
        let point = projection.fromLatLngToDivPixel(position);
        this.div_.style.top = point.y + 'px';
        this.div_.style.left = point.x + 'px';
    };

    open(map: any, path: any, vertex: any) {
        if(this.marker == true){
            if(vertex.lat() && vertex.lng()){
                this.set('position', path.getPosition());
                this.set('path', path);
                this.set('vertex', vertex);
                this.setMap(map);
                this.draw();
            } 
        } else {
            this.set('position', path.getAt(vertex));
            this.set('path', path);
            this.set('vertex', vertex);
            this.setMap(map);
            this.draw();
        }
    };

    removeVertex() {
        let path = this.get('path');
        let vertex = this.get('vertex');
        let position = this.get('position');
    
        if (!path || vertex == undefined) {
          this.close();
          return;
        }

        if(this.marker == true){
            let idxForDelete = this.markersOnSelectedLine.findIndex(x=>x.position.lat() == path.position.lat() && x.position.lng() == path.position.lng());
            this.markersOnSelectedLine.splice(idxForDelete,1);
            localStorage.setItem('markers',JSON.stringify(this.markersOnSelectedLine));
            if(position.lat() && position.lng()) {
                path.setMap(null);
            }
        } else {      
            let idxForDelete = this.linePointsOnSelectedLine.findIndex(x=>x.X == position.lat() && x.Y == position.lng());
            this.linePointsOnSelectedLine.splice(idxForDelete,1);
            localStorage.setItem('lines',JSON.stringify(this.linePointsOnSelectedLine));
            path.removeAt(vertex);
            this.close();
        }
    };
}
