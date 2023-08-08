# Configure the provider
provider "google" {
  project = "sigma-rarity-378302"
  region  = "us-central1"
}

# Create a Kubernetes cluster
resource "google_container_cluster" "cluster" {
  name               = "k8s"
  location           = "us-central1-c"
  initial_node_count = 1

  # Node configuration
  node_config {
    machine_type = "e2-medium"
    disk_size_gb = 10
    disk_type    = "pd-standard"

    # Node image type
    image_type = "COS_CONTAINERD"
  }
}
