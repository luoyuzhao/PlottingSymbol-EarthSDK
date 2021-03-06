import PlotPolylineBase from './base/PlotPolylineBase';

const Tool = XE.Tool;

class GeoCurveArrow extends PlotPolylineBase {
    constructor(earth, guid) {
        super(earth, guid);

        this._leftArrowPosition = [0, 0, 0];
        this._rightArrowPosition = [0, 0, 0];
        this._positions = [];
        this.disposers.push(XE.MVVM.watch(() => {
            return {
                positions: [...this.positions.map(e => [...e])],
                slices: this.slices,
            }
        }, ({ positions, slices }) => {
            const l = positions.length;
            const d = Tool.Math.distance(positions);
            
            if (l < 2) {
                this._polylineShow = false;
                return;
            }

            this._positions.length = 0;
            Tool.Math.interpolatePositions(positions, slices, false, this._positions);

            const ll = this._positions.length;

            const hpr = Tool.Math.hpr(this._positions[ll-1], this._positions[ll-2]);
            if (!hpr) {
                this._polylineShow = false;
                return;
            }
            Tool.Math.geoMove(this._positions[ll-1], hpr[0] + Math.PI/6, d * 0.05, this._leftArrowPosition);
            Tool.Math.geoMove(this._positions[ll-1], hpr[0] - Math.PI/6, d * 0.05, this._rightArrowPosition);

            this._positions.push([...this._leftArrowPosition]);
            this._positions.push([...this._positions[ll-1]]);
            this._positions.push([...this._rightArrowPosition]);
            this._positions.push([...this._positions[ll-1]]);

            this._polyline.positions = this._positions;

            this._polylineShow = true;
        }));
    }
}

GeoCurveArrow.defaultOptions = {
    /**
     * 曲线分段数
     * @type {number}
     * @instance
     * @default 100
     * @memberof XE.Obj.Plots.GeoCurveArrow
     */
    slices: 100
};
        
GeoCurveArrow.registerType(GeoCurveArrow, 'GeoCurveArrow');

export default GeoCurveArrow;
