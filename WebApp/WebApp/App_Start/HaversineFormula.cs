using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApp.Models.DomainEntities;

namespace WebApp.App_Start
{
    public class HaversineFormula
    {
        //private const double R = 6371000.0;
        private const double R = 6351000.0;

        private static double ConvertDegreesToRadians(double angle)
        {
            return angle * Math.PI / 180;
        }
        private static double ConvertRadiansToDegrees(double radian)
        {
            return radian * 180 / Math.PI;
        }

        /// <summary>
        /// a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
        /// c = 2 ⋅ atan2( √a, √(1−a) )
        /// d = R ⋅ c
        /// where   φ is latitude, λ is longitude, R is earth’s radius
        /// note that angles need to be in radians to pass to trig functions!
        /// </summary>
        /// <param name="firstLatitude"></param>
        /// <param name="firstLongitude"></param>
        /// <param name="secondLatitude"></param>
        /// <param name="secondLongidute"></param>
        /// <returns>Distance between chosen points</returns>
        public static double CalculateDistanceBetweenTwoPoints(
            double firstLatitude, double firstLongitude,
            double secondLatitude, double secondLongidute)
        {
            firstLatitude = HaversineFormula.ConvertDegreesToRadians(firstLatitude);
            firstLongitude = HaversineFormula.ConvertDegreesToRadians(firstLongitude);
            secondLatitude = HaversineFormula.ConvertDegreesToRadians(secondLatitude);
            secondLongidute = HaversineFormula.ConvertDegreesToRadians(secondLongidute);
            double a = 0.5 - Math.Cos(secondLatitude - firstLatitude) / 2 + Math.Cos(firstLatitude) * Math.Cos(secondLatitude) * (1 - Math.Cos(secondLongidute - firstLongitude))/2;
            // ili 2*R*Math.atan2(sqrt(a), sqrt(1-a));
            return 2 * R * Math.Asin(Math.Sqrt(a));
        }

        /// <summary>
        /// Bearing: The horizontal angle at a given point, measured clockwise from magnetic north or true north to a second point.
        /// Let ‘R’ be the radius of Earth,
        /// ‘L’ be the longitude,
        /// ‘θ’ be latitude,
        /// ‘β‘ be Bearing.
        /// Bearing from point A to B, can be calculated as,
        /// β = atan2(X, Y),
        /// where, X and Y are two quantities and can be calculated as:
        /// X = cos θb* sin ∆L
        /// Y = cos θa* sin θb – sin θa * cos θb * cos ∆L
        /// </summary>
        /// <param name="firstLatitude"></param>
        /// <param name="firstLongitude"></param>
        /// <param name="secondLatitude"></param>
        /// <param name="secondLongidute"></param>
        /// <returns>Bearing from first to second point</returns>
        public static double Bearing(
            double firstLatitude, double firstLongitude,
            double secondLatitude, double secondLongidute)
        {
            firstLatitude = HaversineFormula.ConvertDegreesToRadians(firstLatitude);
            firstLongitude = HaversineFormula.ConvertDegreesToRadians(firstLongitude);
            secondLatitude = HaversineFormula.ConvertDegreesToRadians(secondLatitude);
            secondLongidute = HaversineFormula.ConvertDegreesToRadians(secondLongidute);
            double firstPoint = Math.Cos(secondLatitude) * Math.Sin(secondLongidute - firstLongitude);
            double secondPoint = (Math.Cos(firstLatitude) * Math.Sin(secondLatitude)) - (Math.Sin(firstLatitude) * Math.Cos(secondLatitude) * Math.Cos(secondLongidute - firstLongitude));
            return Math.Atan2(firstPoint, secondPoint);
        }


        /// <summary>
        /// Let first point latitude be la1,
        /// longitude as lo1,
        /// d be distance,
        /// R as radius of Earth,
        /// Ad be the angular distance i.e d/R and
        /// θ be the bearing,
        /// Here is the formula to find the second point, when first point, bearing and distance is known:
        /// latitude of second point = la2 = asin(sin la1 * cos Ad + cos la1 * sin Ad * cos θ), and
        /// longitude  of second point = lo2 = lo1 + atan2(sin θ * sin Ad * cos la1, cos Ad – sin la1 * sin la2)
        /// </summary>
        /// <param name="oldLatitude"></param>
        /// <param name="oldLongitude"></param>
        /// <param name="bearing"></param>
        /// <param name="distance"></param>
        /// <returns>New set of latitude and longitude points</returns>
        public static (double,double) CalculateNewSetOfPoints(
            double oldLatitude, double oldLongitude,
            double bearing, double distance)
        {
            oldLatitude = HaversineFormula.ConvertDegreesToRadians(oldLatitude);
            oldLongitude = HaversineFormula.ConvertDegreesToRadians(oldLongitude);
            double Ad = distance / R;
            double newLatitude = Math.Asin(Math.Sin(oldLatitude) * Math.Cos(Ad) + Math.Cos(oldLatitude) * Math.Sin(Ad) * Math.Cos(bearing));
            double newLongitude = oldLongitude + Math.Atan2(Math.Sin(bearing) * Math.Sin(Ad) * Math.Cos(oldLatitude), Math.Cos(Ad) - Math.Sin(oldLatitude) * Math.Sin(newLatitude));
            return (Math.Round(HaversineFormula.ConvertRadiansToDegrees(newLatitude),8), Math.Round(HaversineFormula.ConvertRadiansToDegrees(newLongitude),8));
        }

        public static IEnumerable<(double, double)> MoveAtRoute(
            double firstLatitude, double firstLongitude,
            double secondLatitude, double secondLongidute,
            double stepLengthToMove, double precisionOfStep)
        {
            firstLatitude = HaversineFormula.ConvertDegreesToRadians(firstLatitude);
            firstLongitude = HaversineFormula.ConvertDegreesToRadians(firstLongitude);
            secondLatitude = HaversineFormula.ConvertDegreesToRadians(secondLatitude);
            secondLongidute = HaversineFormula.ConvertDegreesToRadians(secondLongidute);

            IList<(double, double)> newLatLng = new List<(double, double)>();
            //if (precisionOfStep < stepLengthToMove)
            //    return (0, 0);

            while (HaversineFormula.CalculateDistanceBetweenTwoPoints(
                     firstLatitude, firstLongitude,
                     secondLatitude, secondLongidute) > precisionOfStep)
            {
                double bearing = HaversineFormula.Bearing(firstLatitude, firstLongitude,
                                                    secondLatitude, secondLongidute);
                //newLatLng.Clear();
                newLatLng.Add(HaversineFormula.CalculateNewSetOfPoints(firstLatitude, firstLongitude, bearing, precisionOfStep));
                //yield return newLatLng[0];
                //return HaversineFormula.CalculateNewSetOfPoints(firstLatitude, firstLongitude, bearing, precisionOfStep);
            }
            return newLatLng;
        }

        /*public static IEnumerable<(double, double)> MoveOnRoute(List<LinePoint> path, double stepLength)
        {
            double precisionOfStep = stepLength + 0.02;
            IList<(double, double)> startPoint = new List<(double, double)> { (HaversineFormula.ConvertToRadians(path[0].X), HaversineFormula.ConvertToRadians(path[0].Y)) };
            //IList<(double, double)> newLatLng = new List<(double, double)>();
            for (int i = 0; i < path.Count-1;i++)
            {
                var endPoint = new List<(double, double)> { (HaversineFormula.ConvertToRadians(path[i + 1].X), HaversineFormula.ConvertToRadians(path[i + 1].Y)) };

                if (HaversineFormula.CalculateDistanceBetweenTwoPoints(
                    startPoint[0].Item1, startPoint[0].Item2,
                    endPoint[0].Item1, endPoint[0].Item2) < stepLength)
                    continue;

                foreach(var startPointt in MoveAtRoute(startPoint[0].Item1, startPoint[0].Item2,
                    endPoint[0].Item1, endPoint[0].Item2, stepLength, precisionOfStep))
                {
                    //newLatLng.Clear();
                    //newLatLng.Add(startPointt);
                    //yield return newLatLng[0];
                    yield return startPointt;
                }
            }
        }


    */
    }
}