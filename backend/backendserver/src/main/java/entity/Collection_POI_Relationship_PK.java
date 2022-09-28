package entity;

import java.io.Serializable;
import java.util.Objects;

public class Collection_POI_Relationship_PK implements Serializable {
    private Collection collection;
    private POI poi;

    public Collection_POI_Relationship_PK(Collection collection, POI poi) {
        this.collection = collection;
        this.poi = poi;
    }

    public Collection_POI_Relationship_PK() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Collection_POI_Relationship_PK)) return false;
        Collection_POI_Relationship_PK that = (Collection_POI_Relationship_PK) o;
        return Objects.equals(collection, that.collection) && Objects.equals(poi, that.poi);
    }

    @Override
    public int hashCode() {
        return Objects.hash(collection, poi);
    }
}
