"""
Mock Data Generator for Research Graph API

Generates deterministic mock research paper data for testing the 3D visualization frontend.
Provides consistent data based on query strings and paper relationships.
"""

import uuid
import hashlib
import random
from typing import List, Dict, Any, Optional


class MockDataGenerator:
    """Generates consistent mock data for research papers"""

    # Predefined topics with detailed paper information
    TOPICS = {
        "photosynthesis": [
            {
                "title": "C4 Photosynthesis in Tropical Grasses: Mechanisms and Evolution",
                "summary": "This paper explores the evolutionary adaptations of C4 photosynthesis in tropical grasses, examining the biochemical pathways that concentrate CO2 around Rubisco to reduce photorespiration. The study demonstrates efficiency advantages in warm climates and discusses the genetic modifications required for C4 pathway development.",
                "keywords": ["C4 plants", "carbon fixation", "evolution", "tropical ecology"]
            },
            {
                "title": "Light-Dependent Reactions in Thylakoid Membranes",
                "summary": "A comprehensive review of the light-dependent reactions occurring in the thylakoid membranes of chloroplasts. This research details the electron transport chain, photosystem I and II complexes, and ATP synthesis mechanisms that convert light energy into chemical energy.",
                "keywords": ["chloroplast", "electron transport", "photosystems", "ATP synthesis"]
            },
            {
                "title": "CAM Photosynthesis: Adaptation to Arid Environments",
                "summary": "Analysis of Crassulacean Acid Metabolism as an evolutionary response to water scarcity in desert plants. The paper examines temporal separation of carbon fixation and the Calvin cycle, allowing plants to minimize water loss while maintaining photosynthetic efficiency.",
                "keywords": ["CAM metabolism", "desert plants", "water conservation", "adaptation"]
            },
            {
                "title": "Rubisco: Structure, Function, and Evolutionary Engineering",
                "summary": "Detailed examination of ribulose-1,5-bisphosphate carboxylase/oxygenase (Rubisco), the most abundant protein on Earth. This study investigates its dual carboxylase and oxygenase activities, structural analysis, and attempts to engineer more efficient variants for improved crop productivity.",
                "keywords": ["Rubisco", "carbon fixation", "protein engineering", "crop improvement"]
            },
            {
                "title": "Chlorophyll Biosynthesis and Light Absorption Mechanisms",
                "summary": "Investigation of chlorophyll biosynthetic pathways and the molecular mechanisms of light absorption in photosynthetic organisms. The research covers antenna complexes, energy transfer, and the role of accessory pigments in expanding the absorption spectrum.",
                "keywords": ["chlorophyll", "light harvesting", "antenna complexes", "pigments"]
            },
            {
                "title": "Carbon Fixation Pathways: Comparative Analysis",
                "summary": "Comparative study of C3, C4, and CAM carbon fixation pathways across diverse plant species. The paper analyzes metabolic efficiency, environmental adaptations, and evolutionary pressures that led to pathway diversification.",
                "keywords": ["carbon fixation", "metabolic pathways", "plant evolution", "photosynthetic efficiency"]
            },
            {
                "title": "Photorespiration and Its Role in Plant Metabolism",
                "summary": "Examination of photorespiration as a wasteful process competing with photosynthesis at high temperatures. The study explores its metabolic costs, evolutionary origins, and potential strategies for reducing its impact on crop yields.",
                "keywords": ["photorespiration", "metabolic cost", "temperature effects", "crop productivity"]
            },
            {
                "title": "Artificial Photosynthesis for Renewable Energy",
                "summary": "Research on bio-inspired artificial photosynthesis systems for sustainable energy production. The paper discusses water-splitting catalysts, light-harvesting materials, and attempts to replicate natural photosynthetic efficiency in synthetic systems.",
                "keywords": ["artificial photosynthesis", "renewable energy", "catalysts", "biomimicry"]
            }
        ],
        "quantum computing": [
            {
                "title": "Quantum Entanglement in Multi-Qubit Systems",
                "summary": "Investigation of entanglement properties in quantum computing systems with multiple qubits. This research explores Bell states, EPR pairs, and the role of entanglement in quantum algorithms and quantum communication protocols.",
                "keywords": ["entanglement", "qubits", "quantum states", "Bell inequality"]
            },
            {
                "title": "Superconducting Qubits for Fault-Tolerant Quantum Computing",
                "summary": "Analysis of superconducting circuit architectures for building scalable, fault-tolerant quantum computers. The paper examines transmon qubits, error correction codes, and decoherence mitigation strategies.",
                "keywords": ["superconducting qubits", "error correction", "decoherence", "scalability"]
            },
            {
                "title": "Quantum Algorithms: From Shor to Variational Approaches",
                "summary": "Comprehensive review of quantum algorithms ranging from Shor's factoring algorithm to modern variational quantum eigensolvers. The study compares computational complexity, resource requirements, and practical applications.",
                "keywords": ["quantum algorithms", "Shor algorithm", "VQE", "computational complexity"]
            },
            {
                "title": "Topological Quantum Computing with Anyons",
                "summary": "Exploration of topological approaches to quantum computing using anyonic excitations in two-dimensional systems. The research discusses Majorana fermions, braiding operations, and inherent fault tolerance.",
                "keywords": ["topological computing", "anyons", "Majorana fermions", "braiding"]
            },
            {
                "title": "Quantum Error Correction: Surface Codes and Beyond",
                "summary": "Detailed analysis of quantum error correction techniques, focusing on surface codes and their implementation in near-term quantum devices. The paper examines threshold theorems and overhead costs.",
                "keywords": ["error correction", "surface codes", "threshold theorem", "fault tolerance"]
            },
            {
                "title": "Ion Trap Quantum Computers: Architecture and Scalability",
                "summary": "Study of trapped-ion quantum computing platforms, analyzing gate operations, coherence times, and approaches to scaling up to hundreds of qubits while maintaining high fidelity.",
                "keywords": ["ion traps", "quantum gates", "coherence", "scalability"]
            },
            {
                "title": "Quantum Machine Learning: Hybrid Classical-Quantum Approaches",
                "summary": "Investigation of hybrid quantum-classical algorithms for machine learning applications. The research covers parameterized quantum circuits, gradient-based optimization, and potential quantum advantages.",
                "keywords": ["quantum ML", "hybrid algorithms", "parameterized circuits", "optimization"]
            }
        ],
        "machine learning": [
            {
                "title": "Deep Neural Networks: Architecture and Optimization",
                "summary": "Comprehensive analysis of deep neural network architectures, examining convolutional, recurrent, and transformer-based models. The paper discusses optimization techniques, regularization methods, and training strategies for large-scale networks.",
                "keywords": ["deep learning", "neural networks", "optimization", "architectures"]
            },
            {
                "title": "Transfer Learning in Computer Vision Applications",
                "summary": "Study of transfer learning methodologies for adapting pre-trained models to new vision tasks. The research explores fine-tuning strategies, domain adaptation, and few-shot learning techniques.",
                "keywords": ["transfer learning", "computer vision", "fine-tuning", "domain adaptation"]
            },
            {
                "title": "Reinforcement Learning: From Q-Learning to Deep RL",
                "summary": "Evolution of reinforcement learning algorithms from classical Q-learning to modern deep RL approaches. The paper analyzes policy gradient methods, actor-critic architectures, and applications in robotics and game playing.",
                "keywords": ["reinforcement learning", "Q-learning", "policy gradients", "deep RL"]
            },
            {
                "title": "Attention Mechanisms and Transformer Models",
                "summary": "Detailed examination of attention mechanisms in neural networks, culminating in transformer architectures. The research covers self-attention, multi-head attention, and applications in NLP and vision tasks.",
                "keywords": ["attention", "transformers", "self-attention", "NLP"]
            },
            {
                "title": "Generative Adversarial Networks for Image Synthesis",
                "summary": "Investigation of GAN architectures for generating realistic images and other data modalities. The paper discusses training stability, mode collapse, and various GAN variants for different applications.",
                "keywords": ["GANs", "generative models", "image synthesis", "training dynamics"]
            },
            {
                "title": "Explainable AI: Interpretability in Deep Learning",
                "summary": "Research on methods for interpreting and explaining decisions made by deep learning models. The study covers attention visualization, saliency maps, and post-hoc explanation techniques.",
                "keywords": ["explainable AI", "interpretability", "attention visualization", "transparency"]
            },
            {
                "title": "Few-Shot Learning and Meta-Learning Approaches",
                "summary": "Analysis of learning strategies that enable models to generalize from limited training examples. The paper examines metric learning, prototypical networks, and model-agnostic meta-learning.",
                "keywords": ["few-shot learning", "meta-learning", "metric learning", "generalization"]
            }
        ],
        "climate change": [
            {
                "title": "Global Temperature Trends and Greenhouse Gas Emissions",
                "summary": "Analysis of long-term global temperature records and their correlation with anthropogenic greenhouse gas emissions. The study uses climate models to project future warming scenarios under different emission pathways.",
                "keywords": ["temperature trends", "greenhouse gases", "climate models", "emissions"]
            },
            {
                "title": "Arctic Ice Melt and Sea Level Rise Projections",
                "summary": "Investigation of accelerating Arctic ice loss and its contribution to global sea level rise. The research combines satellite observations with ice sheet models to project future coastal impacts.",
                "keywords": ["Arctic ice", "sea level rise", "ice sheets", "coastal impacts"]
            },
            {
                "title": "Ocean Acidification and Marine Ecosystem Impacts",
                "summary": "Study of increasing ocean acidity due to CO2 absorption and its effects on marine calcifying organisms. The paper examines coral reefs, shellfish, and broader ecosystem disruptions.",
                "keywords": ["ocean acidification", "marine ecosystems", "coral reefs", "CO2 absorption"]
            },
            {
                "title": "Extreme Weather Events: Attribution and Trends",
                "summary": "Analysis of trends in extreme weather phenomena including hurricanes, droughts, and heat waves. The research uses attribution science to quantify climate change's role in specific events.",
                "keywords": ["extreme weather", "attribution", "hurricanes", "droughts"]
            },
            {
                "title": "Carbon Sequestration Technologies and Natural Solutions",
                "summary": "Comprehensive review of carbon capture and storage technologies alongside nature-based solutions like reforestation. The study evaluates effectiveness, costs, and scalability of various approaches.",
                "keywords": ["carbon sequestration", "CCS", "reforestation", "climate solutions"]
            },
            {
                "title": "Climate Feedback Loops: Amplification and Tipping Points",
                "summary": "Examination of positive and negative feedback mechanisms in the climate system. The paper identifies critical tipping points and analyzes permafrost thaw, albedo changes, and methane release.",
                "keywords": ["feedback loops", "tipping points", "permafrost", "methane"]
            }
        ],
        "neuroscience": [
            {
                "title": "Neuroplasticity and Synaptic Modification Mechanisms",
                "summary": "Investigation of brain plasticity at molecular and cellular levels. The research examines long-term potentiation, synaptic pruning, and activity-dependent remodeling throughout development and learning.",
                "keywords": ["neuroplasticity", "synaptic plasticity", "LTP", "learning"]
            },
            {
                "title": "Neural Networks and Brain Connectivity Mapping",
                "summary": "Study of structural and functional connectivity in the human brain using advanced neuroimaging. The paper analyzes network topology, hub regions, and connectivity patterns in health and disease.",
                "keywords": ["brain networks", "connectivity", "neuroimaging", "topology"]
            },
            {
                "title": "Neurotransmitter Systems and Behavioral Regulation",
                "summary": "Comprehensive analysis of major neurotransmitter systems including dopamine, serotonin, and glutamate. The research links molecular mechanisms to behavior, mood regulation, and cognitive functions.",
                "keywords": ["neurotransmitters", "dopamine", "serotonin", "behavior"]
            },
            {
                "title": "Memory Formation and Consolidation in the Hippocampus",
                "summary": "Detailed examination of hippocampal circuits involved in encoding and consolidating episodic memories. The study investigates place cells, replay mechanisms, and interactions with cortical regions.",
                "keywords": ["memory", "hippocampus", "consolidation", "place cells"]
            },
            {
                "title": "Brain-Computer Interfaces: From Neurons to Algorithms",
                "summary": "Research on direct brain-to-computer communication systems. The paper covers neural signal decoding, machine learning applications, and clinical implementations for paralysis and communication disorders.",
                "keywords": ["BCI", "neural decoding", "neuroprosthetics", "machine learning"]
            },
            {
                "title": "Cortical Processing of Visual Information",
                "summary": "Investigation of hierarchical visual processing from retina through primary visual cortex to higher association areas. The research examines receptive fields, feature detection, and object recognition mechanisms.",
                "keywords": ["visual cortex", "processing hierarchy", "receptive fields", "object recognition"]
            }
        ],
        "artificial intelligence": [
            {
                "title": "Large Language Models: Architecture and Scaling Laws",
                "summary": "Analysis of transformer-based language models and their scaling properties. The research examines the relationship between model size, training data, and emergent capabilities in models like GPT and BERT.",
                "keywords": ["LLMs", "transformers", "scaling laws", "language models"]
            },
            {
                "title": "AI Safety and Alignment: Challenges and Approaches",
                "summary": "Study of techniques for ensuring AI systems behave according to human values and intentions. The paper discusses reward modeling, interpretability, and robustness in increasingly capable AI systems.",
                "keywords": ["AI safety", "alignment", "robustness", "interpretability"]
            },
            {
                "title": "Multi-Modal Learning: Vision, Language, and Beyond",
                "summary": "Investigation of AI models that integrate multiple modalities including vision, language, and audio. The research covers cross-modal attention, contrastive learning, and unified representation spaces.",
                "keywords": ["multi-modal", "vision-language", "contrastive learning", "representations"]
            },
            {
                "title": "Neural Architecture Search and AutoML",
                "summary": "Automated methods for discovering optimal neural network architectures. The paper examines evolutionary algorithms, reinforcement learning approaches, and efficient search strategies.",
                "keywords": ["NAS", "AutoML", "architecture search", "optimization"]
            },
            {
                "title": "Continual Learning: Overcoming Catastrophic Forgetting",
                "summary": "Research on enabling neural networks to learn new tasks without forgetting previously learned information. The study covers rehearsal methods, regularization approaches, and dynamic architectures.",
                "keywords": ["continual learning", "catastrophic forgetting", "lifelong learning", "plasticity"]
            },
            {
                "title": "Graph Neural Networks for Relational Reasoning",
                "summary": "Analysis of neural architectures designed for graph-structured data. The paper examines message passing, attention mechanisms on graphs, and applications in molecular property prediction and social networks.",
                "keywords": ["GNNs", "graph learning", "relational reasoning", "message passing"]
            }
        ],
        "genetics": [
            {
                "title": "CRISPR-Cas9 Gene Editing: Mechanisms and Applications",
                "summary": "Comprehensive review of CRISPR-Cas9 technology for precise genome editing. The research covers molecular mechanisms, off-target effects, and therapeutic applications in genetic diseases.",
                "keywords": ["CRISPR", "gene editing", "genome engineering", "therapeutics"]
            },
            {
                "title": "Epigenetics: DNA Methylation and Histone Modifications",
                "summary": "Study of heritable changes in gene expression without alterations to DNA sequence. The paper examines methylation patterns, chromatin remodeling, and epigenetic inheritance across generations.",
                "keywords": ["epigenetics", "DNA methylation", "chromatin", "gene expression"]
            },
            {
                "title": "Single-Cell RNA Sequencing: Revealing Cellular Heterogeneity",
                "summary": "Investigation of single-cell transcriptomics technologies and their applications in understanding tissue complexity. The research covers clustering methods, trajectory analysis, and cell type identification.",
                "keywords": ["scRNA-seq", "transcriptomics", "cell heterogeneity", "clustering"]
            },
            {
                "title": "Population Genetics and Human Evolution",
                "summary": "Analysis of genetic variation across human populations and evolutionary history. The paper uses whole-genome sequencing to trace migrations, admixture events, and selection pressures.",
                "keywords": ["population genetics", "human evolution", "genetic variation", "selection"]
            },
            {
                "title": "Gene Regulatory Networks and Transcription Factors",
                "summary": "Examination of complex regulatory networks controlling gene expression. The research models transcription factor binding, enhancer activity, and network dynamics during development.",
                "keywords": ["gene regulation", "transcription factors", "regulatory networks", "development"]
            },
            {
                "title": "Cancer Genomics: Mutations and Driver Genes",
                "summary": "Study of somatic mutations in cancer genomes and identification of driver genes. The paper analyzes mutational signatures, clonal evolution, and implications for targeted therapies.",
                "keywords": ["cancer genomics", "somatic mutations", "driver genes", "evolution"]
            }
        ]
    }

    def __init__(self):
        """Initialize the mock data generator"""
        # Create a mapping of paper IDs to content for consistency
        self.paper_database: Dict[str, Dict[str, Any]] = {}
        self._initialize_paper_database()

    def _initialize_paper_database(self):
        """Pre-generate consistent paper IDs for all topics"""
        for topic, papers in self.TOPICS.items():
            for idx, paper_info in enumerate(papers):
                # Generate deterministic UUID based on topic and index
                paper_id = self._generate_deterministic_uuid(topic, idx)
                self.paper_database[paper_id] = {
                    "paper_id": paper_id,
                    "topic": topic,
                    "metadata": {
                        "title": paper_info["title"],
                        "summary": paper_info["summary"]
                    },
                    "keywords": paper_info["keywords"],
                    "index": idx
                }

    def _generate_deterministic_uuid(self, topic: str, index: int) -> str:
        """Generate a deterministic UUID based on topic and index"""
        # Create a hash from topic and index
        hash_input = f"{topic}_{index}".encode('utf-8')
        hash_digest = hashlib.md5(hash_input).hexdigest()

        # Format as UUID
        return f"{hash_digest[:8]}-{hash_digest[8:12]}-{hash_digest[12:16]}-{hash_digest[16:20]}-{hash_digest[20:32]}"

    def _generate_similarity_score(self, query: str, paper_data: Dict[str, Any], index: int) -> float:
        """Generate deterministic similarity score"""
        # Base score that decreases with index
        base_score = 0.95 - (index * 0.05)

        # Add small deterministic variation based on query and paper
        hash_input = f"{query}_{paper_data['paper_id']}".encode('utf-8')
        variation = (int(hashlib.md5(hash_input).hexdigest()[:8], 16) % 20) / 100.0  # 0.00 to 0.20

        # Ensure score stays within valid range
        score = max(0.50, min(0.99, base_score + variation - 0.10))
        return round(score, 2)

    def search_papers(self, query: str, count: int = 10) -> List[Dict[str, Any]]:
        """
        Generate mock papers based on search query

        Args:
            query: Search query string
            count: Number of papers to return (default 10)

        Returns:
            List of paper dictionaries with paper_id, metadata, and similarity
        """
        query_lower = query.lower()

        # Find matching topic or use a default
        matching_papers = []

        # Check if query matches any topic
        for topic, papers_list in self.TOPICS.items():
            if topic in query_lower or any(keyword in query_lower for paper in papers_list for keyword in paper.get("keywords", [])):
                # Get papers for this topic
                for paper_id, paper_data in self.paper_database.items():
                    if paper_data["topic"] == topic:
                        matching_papers.append(paper_data)

        # If no matches, use first available topic
        if not matching_papers:
            first_topic = list(self.TOPICS.keys())[0]
            for paper_id, paper_data in self.paper_database.items():
                if paper_data["topic"] == first_topic:
                    matching_papers.append(paper_data)

        # Limit to requested count
        matching_papers = matching_papers[:min(count, len(matching_papers))]

        # Generate results with similarity scores
        results = []
        for idx, paper_data in enumerate(matching_papers):
            similarity = self._generate_similarity_score(query, paper_data, idx)
            results.append({
                "paper_id": paper_data["paper_id"],
                "metadata": paper_data["metadata"],
                "similarity": similarity
            })

        # Sort by similarity (highest first)
        results.sort(key=lambda x: x["similarity"], reverse=True)

        return results

    def get_related_papers(self, paper_id: str, conversation: Optional[str] = None, count: int = 5) -> List[Dict[str, Any]]:
        """
        Get papers related to a specific paper

        Args:
            paper_id: UUID of the source paper
            conversation: Optional conversation context (currently unused)
            count: Number of related papers to return

        Returns:
            List of related paper dictionaries
        """
        # Find the source paper
        if paper_id not in self.paper_database:
            return []

        source_paper = self.paper_database[paper_id]
        source_topic = source_paper["topic"]

        # Get papers from same topic (excluding the source paper)
        related_papers = []
        for pid, paper_data in self.paper_database.items():
            if pid != paper_id and paper_data["topic"] == source_topic:
                related_papers.append(paper_data)

        # Also include some papers from related topics
        related_topics = self._get_related_topics(source_topic)
        for topic in related_topics[:2]:  # Limit to 2 related topics
            for pid, paper_data in self.paper_database.items():
                if paper_data["topic"] == topic:
                    related_papers.append(paper_data)

        # Limit to requested count
        related_papers = related_papers[:count]

        # Generate results with similarity scores
        results = []
        for idx, paper_data in enumerate(related_papers):
            # Related papers have slightly lower similarity
            similarity = self._generate_similarity_score(source_paper["metadata"]["title"], paper_data, idx + 3)
            results.append({
                "paper_id": paper_data["paper_id"],
                "metadata": paper_data["metadata"],
                "similarity": max(0.55, similarity - 0.15)  # Reduce similarity for related papers
            })

        # Sort by similarity
        results.sort(key=lambda x: x["similarity"], reverse=True)

        return results

    def _get_related_topics(self, topic: str) -> List[str]:
        """Get topics related to the given topic"""
        # Define topic relationships
        relationships = {
            "photosynthesis": ["climate change", "genetics"],
            "quantum computing": ["artificial intelligence", "machine learning"],
            "machine learning": ["artificial intelligence", "neuroscience"],
            "climate change": ["photosynthesis", "genetics"],
            "neuroscience": ["artificial intelligence", "machine learning"],
            "artificial intelligence": ["machine learning", "neuroscience", "quantum computing"],
            "genetics": ["neuroscience", "photosynthesis"]
        }
        return relationships.get(topic, [])

    def get_paper_by_id(self, paper_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific paper by its ID"""
        if paper_id in self.paper_database:
            paper_data = self.paper_database[paper_id]
            return {
                "paper_id": paper_data["paper_id"],
                "metadata": paper_data["metadata"],
                "similarity": 1.0  # Perfect match for direct lookup
            }
        return None

    def generate_chat_response(self, paper_id: str, message: str, conversation_history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        """
        Generate a mock chat response about a paper

        Args:
            paper_id: UUID of the paper being discussed
            message: User's message
            conversation_history: Previous conversation messages

        Returns:
            Dictionary with response and paper_context
        """
        # Get paper information
        paper = self.get_paper_by_id(paper_id)

        if not paper:
            return {
                "response": "I'm sorry, I don't have information about that paper.",
                "paper_context": None
            }

        # Generate contextual response based on message
        message_lower = message.lower()
        title = paper["metadata"]["title"]
        summary = paper["metadata"]["summary"]

        # Simple keyword-based responses
        if any(word in message_lower for word in ["summary", "about", "what", "explain"]):
            response = f"This paper, titled '{title}', focuses on {summary[:200]}... The research provides valuable insights into this area of study."
        elif any(word in message_lower for word in ["method", "how", "approach"]):
            response = f"The methodology in '{title}' involves systematic analysis and empirical investigation. The researchers employed rigorous experimental design to validate their findings."
        elif any(word in message_lower for word in ["result", "finding", "conclusion"]):
            response = f"The key findings of this research indicate significant contributions to the field. {summary[100:250]}... These results have important implications for future research."
        elif any(word in message_lower for word in ["application", "use", "practical"]):
            response = f"The applications of this research are quite broad. The findings from '{title}' can be applied to real-world scenarios and inform practical solutions in the field."
        else:
            response = f"That's an interesting question about '{title}'. {summary[:150]}... This research contributes to our understanding of the topic through comprehensive analysis."

        # Extract relevant sections based on paper topic
        paper_data = self.paper_database.get(paper_id, {})
        keywords = paper_data.get("keywords", [])

        return {
            "response": response,
            "paper_context": {
                "title": title,
                "relevant_sections": keywords[:3] if keywords else ["Introduction", "Methodology", "Results"]
            }
        }


# Global instance for use across the application
mock_data_generator = MockDataGenerator()
