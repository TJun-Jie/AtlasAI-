import { Card, CardMedia, CardContent, Typography } from "@mui/material";

export type RecommendedCardProps = {
  title: string;
  description: string;
};

const RecommendedCard: React.FC<RecommendedCardProps> = (props) => {
  return (
    <Card sx={{ maxWidth: 400, margin: 5, height: 200 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {props.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RecommendedCard;
